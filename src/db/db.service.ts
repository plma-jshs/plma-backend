import { Injectable, OnModuleDestroy } from "@nestjs/common";
import mysql from "mysql2/promise";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema";

@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly pool: mysql.Pool;
  readonly db: MySql2Database<typeof schema>;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not defined");
    }

    this.pool = mysql.createPool({
      uri: databaseUrl,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
    this.db = drizzle(this.pool, { schema, mode: "default" });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
