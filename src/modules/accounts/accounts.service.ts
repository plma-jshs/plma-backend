import { Injectable, NotFoundException } from "@nestjs/common";
import { eq, desc, sql } from "drizzle-orm";
import { DbService } from "@/db/db.service";
import { users } from "@/db/schema";
import { ensureFound } from "@/common/db/ensure-found";
import { PasswordService } from "@/common/security/password.service";
import {
  AccountCreateDto,
  AccountListQueryDto,
  AccountUpdateDto,
} from "./dto/accounts.schema";

@Injectable()
export class AccountsService {
  private readonly pageSize = 20;

  constructor(
    private readonly db: DbService,
    private readonly passwordService: PasswordService,
  ) {}

  async create(body: AccountCreateDto) {
    const password = await this.passwordService.hash(body.password);
    const [created] = await this.db.db
      .insert(users)
      .values({
        ...body,
        password,
      })
      .$returningId();

    const createdUser = await this.db.db.query.users.findFirst({
      where: eq(users.id, created.id),
      columns: {
        id: true,
        stuid: true,
        name: true,
        phoneNumber: true,
        studentId: true,
      },
      with: {
        student: {
          columns: {
            id: true,
            stuid: true,
            name: true,
          },
        },
      },
    });

    return ensureFound(createdUser, "account not found");
  }

  async findAll(query: AccountListQueryDto) {
    const page = query.page;
    const offset = (page - 1) * this.pageSize;

    const [data, totalResult] = await Promise.all([
      this.db.db.query.users.findMany({
        columns: {
          id: true,
          stuid: true,
          name: true,
          phoneNumber: true,
          studentId: true,
        },
        with: {
          student: {
            columns: {
              id: true,
              stuid: true,
              name: true,
            },
          },
        },
        orderBy: [desc(users.id)],
        offset,
        limit: this.pageSize,
      }),
      this.db.db.select({ total: sql<number>`count(*)` }).from(users),
    ]);

    const total = Number(totalResult[0]?.total ?? 0);
    const lastPage = total === 0 ? 0 : Math.ceil(total / this.pageSize);

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.db.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        id: true,
        stuid: true,
        name: true,
        phoneNumber: true,
        studentId: true,
      },
      with: {
        student: {
          columns: {
            id: true,
            stuid: true,
            name: true,
          },
        },
      },
    });

    return ensureFound(user, "account not found");
  }

  async update(id: number, body: AccountUpdateDto) {
    const password =
      body.password === undefined
        ? undefined
        : await this.passwordService.hash(body.password);

    await this.db.db
      .update(users)
      .set({ ...body, password })
      .where(eq(users.id, id));

    const updatedUser = await this.db.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        id: true,
        stuid: true,
        name: true,
        phoneNumber: true,
        studentId: true,
      },
      with: {
        student: {
          columns: {
            id: true,
            stuid: true,
            name: true,
          },
        },
      },
    });

    return ensureFound(updatedUser, "account not found");
  }

  async remove(id: number) {
    const existingUser = await this.db.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: { id: true },
    });

    ensureFound(existingUser, "account not found");

    await this.db.db.delete(users).where(eq(users.id, id));
  }
}
