import 'dotenv/config';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  MethodDeclaration,
  Project,
  SourceFile,
  SyntaxKind,
  Type,
} from 'ts-morph';
import { z } from 'zod';
import { AppModule } from '../src/app.module';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type ParamKind = 'body' | 'query' | 'param';

const HTTP_DECORATOR_TO_METHOD: Record<string, HttpMethod> = {
  Get: 'get',
  Post: 'post',
  Put: 'put',
  Patch: 'patch',
  Delete: 'delete',
};

const loadedModules = new Map<string, Record<string, unknown>>();
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

function normalizePath(basePath: string, routePath: string) {
  const trim = (text: string) => text.replace(/^\/+|\/+$/g, '');
  const base = trim(basePath);
  const route = trim(routePath);
  const merged = [base, route].filter(Boolean).join('/');
  const normalized = `/${merged}`.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');

  return normalized === '/' ? '/' : normalized.replace(/\/+/g, '/');
}

function getDecoratorStringArgument(methodOrClass: {
  getDecorators: () => { getName: () => string; getArguments: () => { getKind: () => SyntaxKind; getLiteralText?: () => string; getText: () => string }[] }[];
},
decoratorName: string) {
  const decorator = methodOrClass.getDecorators().find((item) => item.getName() === decoratorName);
  if (!decorator) {
    return '';
  }

  const firstArgument = decorator.getArguments()[0];
  if (!firstArgument) {
    return '';
  }

  if (
    firstArgument.getKind() === SyntaxKind.StringLiteral
    || firstArgument.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral
  ) {
    return firstArgument.getLiteralText?.() ?? firstArgument.getText().replace(/^['"`]|['"`]$/g, '');
  }

  return '';
}

function resolveImportTargetPath(sourceFilePath: string, moduleSpecifier: string) {
  const baseDir = dirname(sourceFilePath);
  const rawPath = resolve(baseDir, moduleSpecifier);

  if (existsSync(rawPath) && rawPath.endsWith('.ts')) {
    return rawPath;
  }
  if (existsSync(`${rawPath}.ts`)) {
    return `${rawPath}.ts`;
  }
  if (existsSync(resolve(rawPath, 'index.ts'))) {
    return resolve(rawPath, 'index.ts');
  }

  return null;
}

function loadModuleExports(filePath: string) {
  const cached = loadedModules.get(filePath);
  if (cached) {
    return cached;
  }

  const loaded = require(filePath) as Record<string, unknown>;
  loadedModules.set(filePath, loaded);
  return loaded;
}

function resolveZodSchemaFromIdentifier(sourceFile: SourceFile, schemaIdentifier: string) {
  for (const importDeclaration of sourceFile.getImportDeclarations()) {
    const moduleSpecifier = importDeclaration.getModuleSpecifierValue();

    if (!moduleSpecifier.startsWith('.')) {
      continue;
    }

    for (const namedImport of importDeclaration.getNamedImports()) {
      const localName = namedImport.getAliasNode()?.getText() ?? namedImport.getName();
      if (localName !== schemaIdentifier) {
        continue;
      }

      const exportName = namedImport.getName();
      const targetPath = resolveImportTargetPath(sourceFile.getFilePath(), moduleSpecifier);
      if (!targetPath) {
        return null;
      }

      const moduleExports = loadModuleExports(targetPath);
      const schemaValue = moduleExports[exportName] as { safeParse?: (data: unknown) => unknown } | undefined;

      if (!schemaValue || typeof schemaValue.safeParse !== 'function') {
        return null;
      }

      return schemaValue;
    }
  }

  return null;
}

function resolveZodSchemaFromFile(filePath: string, exportName: string) {
  if (!existsSync(filePath)) {
    return null;
  }

  const moduleExports = loadModuleExports(filePath);
  const schemaValue = moduleExports[exportName] as { safeParse?: (data: unknown) => unknown } | undefined;

  if (!schemaValue || typeof schemaValue.safeParse !== 'function') {
    return null;
  }

  return schemaValue;
}

function resolveResponseSchemaByMethod(sourceFile: SourceFile, methodName: string) {
  const responseSchemaName = `${methodName}ResponseSchema`;

  for (const importDeclaration of sourceFile.getImportDeclarations()) {
    const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
    if (!moduleSpecifier.startsWith('.')) {
      continue;
    }

    const hasNamedImport = importDeclaration.getNamedImports().some((namedImport) => {
      const localName = namedImport.getAliasNode()?.getText() ?? namedImport.getName();
      return localName === responseSchemaName;
    });

    if (!hasNamedImport) {
      continue;
    }

    const targetPath = resolveImportTargetPath(sourceFile.getFilePath(), moduleSpecifier);
    if (!targetPath) {
      continue;
    }

    const schema = resolveZodSchemaFromFile(targetPath, responseSchemaName);
    if (schema) {
      return schema;
    }
  }

  const moduleDir = dirname(sourceFile.getFilePath());
  const dtoDir = resolve(moduleDir, 'dto');
  if (!existsSync(dtoDir)) {
    return null;
  }

  const schemaFiles = readdirSync(dtoDir)
    .filter((fileName) => fileName.endsWith('.schema.ts'))
    .map((fileName) => resolve(dtoDir, fileName));

  for (const filePath of schemaFiles) {
    const schema = resolveZodSchemaFromFile(filePath, responseSchemaName);
    if (schema) {
      return schema;
    }
  }

  return null;
}

function toOpenApiSchemaFromZod(schema: unknown) {
  const jsonSchema = z.toJSONSchema(schema as never) as Record<string, unknown>;
  delete jsonSchema.$schema;
  return normalizeSchema(jsonSchema);
}

function makeExampleBySchema(schema: Record<string, unknown>, propertyName?: string): unknown {
  const schemaType = schema.type as string | undefined;

  if (schema.example !== undefined) {
    return schema.example;
  }

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum[0];
  }

  if (schemaType === 'string') {
    if (schema.format === 'date-time') {
      return '2026-01-01T00:00:00.000Z';
    }

    if (schema.format === 'uri') {
      return 'https://example.com';
    }
  }

  if (schemaType === 'string') {
    if (typeof propertyName === 'string' && /password/i.test(propertyName)) {
      return 'password123!';
    }

    const minLength = typeof schema.minLength === 'number' ? schema.minLength : 0;
    return minLength > 0 ? 'a'.repeat(Math.max(1, Math.min(minLength, 16))) : 'string';
  }

  if (schemaType === 'integer' || schemaType === 'number') {
    if (typeof schema.minimum === 'number') {
      return schema.minimum;
    }
    return schemaType === 'integer' ? 1 : 1.0;
  }

  if (schemaType === 'boolean') {
    return true;
  }

  if (schemaType === 'array') {
    const itemSchema = (schema.items ?? {}) as Record<string, unknown>;
    return [makeExampleBySchema(itemSchema)];
  }

  if (schemaType === 'object') {
    const properties = (schema.properties ?? {}) as Record<string, Record<string, unknown>>;
    const required = new Set(Array.isArray(schema.required) ? (schema.required as string[]) : []);
    const result: Record<string, unknown> = {};

    for (const [name, propertySchema] of Object.entries(properties)) {
      if (required.size > 0 && !required.has(name)) {
        continue;
      }

      result[name] = makeExampleBySchema(propertySchema, name);
    }

    return result;
  }

  if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    const preferred = (schema.oneOf as Record<string, unknown>[]).find((item) => item.type !== 'null')
      ?? schema.oneOf[0] as Record<string, unknown>;
    return makeExampleBySchema(preferred, propertyName);
  }

  if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    const preferred = (schema.anyOf as Record<string, unknown>[]).find((item) => item.type !== 'null')
      ?? schema.anyOf[0] as Record<string, unknown>;
    return makeExampleBySchema(preferred, propertyName);
  }

  return null;
}

function sanitizeExampleBySchema(schema: Record<string, unknown>, example: unknown) {
  if (example === undefined) {
    return example;
  }

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum.includes(example) ? example : schema.enum[0];
  }

  const schemaType = schema.type as string | undefined;

  if (schemaType === 'string') {
    if (example === null) {
      return makeExampleBySchema(schema);
    }

    if (typeof example !== 'string') {
      return makeExampleBySchema(schema);
    }

    if (schema.format === 'date-time') {
      const parsed = Date.parse(example);
      if (Number.isNaN(parsed)) {
        return '2026-01-01T00:00:00.000Z';
      }
    }

    if (schema.format === 'uri') {
      const isUri = /^https?:\/\//i.test(example);
      if (!isUri) {
        return 'https://example.com';
      }
    }

    return example;
  }

  if (schemaType === 'integer') {
    if (typeof example !== 'number' || !Number.isInteger(example)) {
      return makeExampleBySchema(schema);
    }
    return example;
  }

  if (schemaType === 'number') {
    if (typeof example !== 'number' || Number.isNaN(example)) {
      return makeExampleBySchema(schema);
    }
    return example;
  }

  if (schemaType === 'boolean') {
    if (typeof example !== 'boolean') {
      return makeExampleBySchema(schema);
    }
    return example;
  }

  if (schemaType === 'array') {
    if (!Array.isArray(example)) {
      return makeExampleBySchema(schema);
    }
    return example;
  }

  if (schemaType === 'object') {
    if (typeof example !== 'object' || example === null || Array.isArray(example)) {
      return makeExampleBySchema(schema);
    }
    return example;
  }

  return example;
}

function normalizeSchema(schema: Record<string, unknown>, propertyName?: string): Record<string, unknown> {
  if (typeof schema !== 'object' || schema === null) {
    return schema;
  }

  const normalized: Record<string, unknown> = { ...schema };

  if (normalized.maximum === MAX_SAFE_INTEGER) {
    delete normalized.maximum;
  }
  if (normalized.minimum === MIN_SAFE_INTEGER) {
    delete normalized.minimum;
  }

  if (normalized.type === 'object' && typeof normalized.properties === 'object' && normalized.properties) {
    const nextProperties: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(normalized.properties as Record<string, unknown>)) {
      nextProperties[key] = normalizeSchema(value as Record<string, unknown>, key);
    }
    normalized.properties = nextProperties;
  }

  if (normalized.type === 'array' && normalized.items && typeof normalized.items === 'object') {
    normalized.items = normalizeSchema(normalized.items as Record<string, unknown>);
  }

  if (Array.isArray(normalized.oneOf)) {
    normalized.oneOf = normalized.oneOf.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return normalizeSchema(item as Record<string, unknown>);
      }
      return item;
    });
  }

  if (Array.isArray(normalized.anyOf)) {
    normalized.anyOf = normalized.anyOf.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return normalizeSchema(item as Record<string, unknown>);
      }
      return item;
    });
  }

  if (Array.isArray(normalized.allOf)) {
    normalized.allOf = normalized.allOf.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return normalizeSchema(item as Record<string, unknown>);
      }
      return item;
    });
  }

  if (normalized.example === undefined) {
    normalized.example = makeExampleBySchema(normalized, propertyName);
  }

  normalized.example = sanitizeExampleBySchema(normalized, normalized.example);

  return normalized;
}

function unwrapResponseType(type: Type, method: MethodDeclaration) {
  let currentType = type;

  for (let index = 0; index < 6; index += 1) {
    const typeText = currentType.getText(method);
    const typeArguments = currentType.getTypeArguments();
    const isPromiseLike = /^Promise<.*>$/.test(typeText)
      || /Prisma__.*Client<.*>/.test(typeText)
      || (currentType.getProperties().some((property) => property.getName() === 'then') && typeArguments.length > 0);

    if (!isPromiseLike || typeArguments.length === 0) {
      break;
    }

    currentType = typeArguments[0];
  }

  return currentType;
}

function getParamKindByVariable(method: MethodDeclaration) {
  const paramKinds = new Map<string, ParamKind>();

  for (const parameter of method.getParameters()) {
    const decorator = parameter.getDecorators()[0];
    if (!decorator) {
      continue;
    }

    const decoratorName = decorator.getName();
    if (decoratorName === 'Body') {
      paramKinds.set(parameter.getName(), 'body');
    }
    else if (decoratorName === 'Query') {
      paramKinds.set(parameter.getName(), 'query');
    }
    else if (decoratorName === 'Param') {
      paramKinds.set(parameter.getName(), 'param');
    }
  }

  return paramKinds;
}

function applyBodySchema(operation: Record<string, unknown>, schema: Record<string, unknown>) {
  const requiredFields = Array.isArray(schema.required) ? schema.required : [];

  operation.requestBody = {
    required: requiredFields.length > 0,
    content: {
      'application/json': {
        schema: normalizeSchema(schema),
      },
    },
  };
}

function applyParamOrQuerySchema(
  operation: Record<string, unknown>,
  schema: Record<string, unknown>,
  inType: 'path' | 'query',
  pathParamNames: string[],
) {
  const required = new Set(Array.isArray(schema.required) ? (schema.required as string[]) : []);
  const properties = (schema.properties ?? {}) as Record<string, Record<string, unknown>>;
  const currentParameters = Array.isArray(operation.parameters)
    ? [...(operation.parameters as Record<string, unknown>[])]
    : [];

  const addOrReplaceParameter = (name: string, parameterSchema: Record<string, unknown>) => {
    const filtered = currentParameters.filter((parameter) => {
      return !(parameter.in === inType && parameter.name === name);
    });

    filtered.push({
      name,
      in: inType,
      required: inType === 'path' ? true : required.has(name),
      schema: normalizeSchema(parameterSchema),
    });

    currentParameters.splice(0, currentParameters.length, ...filtered);
  };

  const propertyEntries = Object.entries(properties);
  if (propertyEntries.length > 0) {
    for (const [propertyName, propertySchema] of propertyEntries) {
      addOrReplaceParameter(propertyName, propertySchema);
    }
  }
  else if (inType === 'path' && pathParamNames.length === 1) {
    addOrReplaceParameter(pathParamNames[0], schema);
  }

  operation.parameters = currentParameters;
}

function inferSchemaFromType(
  type: Type,
  method: MethodDeclaration,
  depth = 0,
  propertyName?: string,
): Record<string, unknown> {
  if (depth > 5) {
    return normalizeSchema({ type: 'object' }, propertyName);
  }

  const typeText = type.getText(method);

  if (/\bDate\b/.test(typeText)) {
    return normalizeSchema({
      type: 'string',
      format: 'date-time',
      example: '2026-01-01T00:00:00.000Z',
    }, propertyName);
  }

  if (type.isString()) {
    return normalizeSchema({ type: 'string' }, propertyName);
  }
  if (type.isNumber()) {
    return normalizeSchema({ type: 'number' }, propertyName);
  }
  if (type.isBoolean()) {
    return normalizeSchema({ type: 'boolean' }, propertyName);
  }
  if (type.isNull() || type.isUndefined() || type.isVoid() || type.isNever()) {
    return normalizeSchema({ type: 'null' }, propertyName);
  }

  if (type.isUnion()) {
    const oneOf = type
      .getUnionTypes()
      .map((member) => inferSchemaFromType(member, method, depth + 1, propertyName));
    return normalizeSchema({ oneOf }, propertyName);
  }

  if (type.isArray()) {
    const elementType = type.getArrayElementType();
    const items = elementType
      ? inferSchemaFromType(elementType, method, depth + 1, propertyName)
      : normalizeSchema({ type: 'object' });
    return normalizeSchema({ type: 'array', items }, propertyName);
  }

  const typeArguments = type.getTypeArguments();
  if (/^Promise<.*>$/.test(typeText) && typeArguments.length > 0) {
    return inferSchemaFromType(typeArguments[0], method, depth + 1, propertyName);
  }

  const properties = type.getProperties();
  const apparentProperties = type.getApparentType().getProperties();
  const targetProperties = properties.length > 0 ? properties : apparentProperties;
  if (targetProperties.length > 0) {
    const nextProperties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const property of targetProperties) {
      const declarations = property.getDeclarations();
      if (declarations.length === 0) {
        continue;
      }

      const declaration = declarations[0];
      const propertyType = property.getTypeAtLocation(declaration);

      if (property.getName().startsWith('__@')) {
        continue;
      }
      if (propertyType.getCallSignatures().length > 0) {
        continue;
      }

      const propertySchema = inferSchemaFromType(propertyType, method, depth + 1, property.getName());

      nextProperties[property.getName()] = propertySchema;

      const propertyTypeText = propertyType.getText(method);
      const isOptional = declaration.asKind(SyntaxKind.PropertySignature)?.hasQuestionToken()
        ?? declaration.asKind(SyntaxKind.PropertyDeclaration)?.hasQuestionToken()
        ?? false;
      const includesUndefined = /\bundefined\b/.test(propertyTypeText);

      if (!isOptional && !includesUndefined) {
        required.push(property.getName());
      }
    }

    const objectSchema: Record<string, unknown> = {
      type: 'object',
      properties: nextProperties,
    };

    if (required.length > 0) {
      objectSchema.required = required;
    }

    return normalizeSchema(objectSchema, propertyName);
  }

  return normalizeSchema({ type: 'object' }, propertyName);
}

function findSuccessStatusCode(operation: Record<string, unknown>) {
  const responses = (operation.responses ?? {}) as Record<string, unknown>;
  const preferred = ['200', '201', '202', '203'];

  for (const code of preferred) {
    if (responses[code]) {
      return code;
    }
  }

  const available = Object.keys(responses).find((code) => /^2\d\d$/.test(code));
  return available ?? '200';
}

function applyResponseSchema(operation: Record<string, unknown>, schema: Record<string, unknown>) {
  const responses = ((operation.responses ?? {}) as Record<string, Record<string, unknown>>);
  operation.responses = responses;

  const code = findSuccessStatusCode(operation);
  if (code === '204') {
    return;
  }

  const response = (responses[code] ?? { description: '' }) as Record<string, unknown>;
  responses[code] = response;

  response.content = {
    'application/json': {
      schema: normalizeSchema(schema),
    },
  };
}

function isTrivialResponseSchema(schema: Record<string, unknown>) {
  if (schema.type === 'object') {
    const properties = schema.properties as Record<string, unknown> | undefined;
    return !properties || Object.keys(properties).length === 0;
  }

  if (schema.type === 'array') {
    const items = schema.items as Record<string, unknown> | undefined;
    if (!items) {
      return true;
    }

    if (items.type === 'object') {
      const properties = items.properties as Record<string, unknown> | undefined;
      return !properties || Object.keys(properties).length === 0;
    }
  }

  return false;
}

async function enhanceDocumentWithZod(document: Record<string, unknown>) {
  const project = new Project({
    tsConfigFilePath: resolve(process.cwd(), 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  });

  const controllerFiles = project.getSourceFiles('src/modules/**/*.controller.ts');

  for (const sourceFile of controllerFiles) {
    for (const classDeclaration of sourceFile.getClasses()) {
      const basePath = getDecoratorStringArgument(classDeclaration, 'Controller');
      if (basePath === '' && !classDeclaration.getDecorators().some((item) => item.getName() === 'Controller')) {
        continue;
      }

      for (const method of classDeclaration.getMethods()) {
        const routeDecorator = method
          .getDecorators()
          .find((decorator) => Object.prototype.hasOwnProperty.call(HTTP_DECORATOR_TO_METHOD, decorator.getName()));

        if (!routeDecorator) {
          continue;
        }

        const httpMethod = HTTP_DECORATOR_TO_METHOD[routeDecorator.getName()];
        const routePath = getDecoratorStringArgument(method, routeDecorator.getName());
        const fullPath = normalizePath(basePath, routePath);
        const operation = ((document.paths as Record<string, Record<string, Record<string, unknown>>> | undefined)
          ?.[fullPath]?.[httpMethod]) as Record<string, unknown> | undefined;

        if (!operation) {
          continue;
        }

        const pathParamNames = [...fullPath.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
        const paramKinds = getParamKindByVariable(method);

        const parseCalls = method
          .getDescendantsOfKind(SyntaxKind.CallExpression)
          .filter((callExpression) => callExpression.getExpression().getText().endsWith('parseZod'));

        for (const parseCall of parseCalls) {
          const [schemaArg, valueArg] = parseCall.getArguments();
          if (!schemaArg || !valueArg) {
            continue;
          }

          const schemaIdentifier = schemaArg.getText();
          const valueIdentifier = valueArg.getText();
          const paramKind = paramKinds.get(valueIdentifier);

          if (!paramKind) {
            continue;
          }

          const zodSchema = resolveZodSchemaFromIdentifier(sourceFile, schemaIdentifier);
          if (!zodSchema) {
            continue;
          }

          const openApiSchema = toOpenApiSchemaFromZod(zodSchema);

          if (paramKind === 'body') {
            applyBodySchema(operation, openApiSchema);
          }
          else if (paramKind === 'query') {
            applyParamOrQuerySchema(operation, openApiSchema, 'query', pathParamNames);
          }
          else if (paramKind === 'param') {
            applyParamOrQuerySchema(operation, openApiSchema, 'path', pathParamNames);
          }
        }

        const explicitResponseSchema = resolveResponseSchemaByMethod(sourceFile, method.getName());
        if (explicitResponseSchema) {
          applyResponseSchema(operation, toOpenApiSchemaFromZod(explicitResponseSchema));
          continue;
        }

        const returnType = unwrapResponseType(method.getReturnType(), method);
        const returnSchema = inferSchemaFromType(returnType, method);
        if (!isTrivialResponseSchema(returnSchema)) {
          applyResponseSchema(operation, returnSchema);
        }
      }
    }
  }
}

async function generateSwagger() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('PLMA API')
      .setDescription('PLMA API documentation')
      .setVersion('0.0')
      .build(),
  );

  await enhanceDocumentWithZod(document as unknown as Record<string, unknown>);

  const outputPath = resolve(process.cwd(), 'docs', 'swagger.json');
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8');

  await app.close();
  console.log(`Swagger generated: ${outputPath}`);
}

generateSwagger().catch((error) => {
  console.error(error);
  process.exit(1);
});
