import { z } from 'zod';

const sessionStudentSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
  grade: z.number().int(),
  class: z.number().int(),
  num: z.number().int(),
  point: z.number().int(),
});

const sessionUserSchema = z.object({
  id: z.number().int(),
  stuid: z.number().int(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
  studentId: z.number().int().nullable(),
  student: sessionStudentSchema.nullable(),
});

export const getCurrentUserResponseSchema = sessionUserSchema.nullable();

export const checkSessionSwaggerSchema = {
  type: 'object',
  required: ['isLogined'],
  example: {
    isLogined: true,
    iamId: 123,
    userId: 10,
    plmaId: 2,
    stuid: 2301,
    name: '홍길동',
    jshsus: true,
  },
  properties: {
    isLogined: { type: 'boolean', example: true },
    iamId: { type: 'number', example: 123, nullable: true },
    userId: { type: 'number', example: 10, nullable: true },
    plmaId: { type: 'number', example: 2, nullable: true },
    stuid: { type: 'number', example: 2301, nullable: true },
    name: { type: 'string', example: '홍길동', nullable: true },
    jshsus: { type: 'boolean', example: true, nullable: true },
  },
  additionalProperties: true,
};

export const apiUserSwaggerSchema = {
  type: 'object',
  required: ['isLogined', 'user'],
  example: {
    isLogined: true,
    iamId: 123,
    userId: 10,
    stuid: 2301,
    name: '홍길동',
    user: {
      id: 10,
      stuid: 2301,
      name: '홍길동',
      phoneNumber: '01012341234',
      studentId: 1,
      student: {
        id: 1,
        stuid: 2301,
        name: '홍길동',
        grade: 3,
        class: 1,
        num: 5,
        point: 12,
      },
    },
  },
  properties: {
    isLogined: { type: 'boolean', example: true },
    user: {
      oneOf: [
        {
          type: 'object',
          properties: {
            id: { type: 'number', example: 10 },
            stuid: { type: 'number', example: 2301 },
            name: { type: 'string', example: '홍길동' },
            phoneNumber: { type: 'string', nullable: true, example: '01012341234' },
            studentId: { type: 'number', nullable: true, example: 1 },
            student: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    stuid: { type: 'number', example: 2301 },
                    name: { type: 'string', example: '홍길동' },
                    grade: { type: 'number', example: 3 },
                    class: { type: 'number', example: 1 },
                    num: { type: 'number', example: 5 },
                    point: { type: 'number', example: 12 },
                  },
                },
                { type: 'null' },
              ],
            },
          },
        },
        { type: 'null' },
      ],
    },
  },
  additionalProperties: true,
};
