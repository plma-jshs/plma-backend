import { Injectable, NotFoundException } from "@nestjs/common";
import { desc, eq, sql } from "drizzle-orm";
import { DbService } from "@/db/db.service";
import { songs } from "@/db/schema";
import { ensureFound } from "@/common/db/ensure-found";
import {
  SongCreateDto,
  SongListQueryDto,
  SongUpdateDto,
} from "./dto/songs.schema";

@Injectable()
export class SongsService {
  constructor(private readonly db: DbService) {}

  async create(body: SongCreateDto) {
    const [created] = await this.db.db
      .insert(songs)
      .values(body)
      .$returningId();
    const createdSong = ensureFound(
      await this.db.db.query.songs.findFirst({
        where: eq(songs.id, created.id),
      }),
      "song not found",
    );

    return createdSong;
  }

  async findAll(query: SongListQueryDto) {
    const { page, size } = query;

    const [data, totalResult] = await Promise.all([
      this.db.db
        .select()
        .from(songs)
        .orderBy(desc(songs.id))
        .offset((page - 1) * size)
        .limit(size),
      this.db.db.select({ total: sql<number>`count(*)` }).from(songs),
    ]);

    const total = Number(totalResult[0]?.total ?? 0);
    const lastPage = total === 0 ? 0 : Math.ceil(total / size);

    return {
      data,
      meta: {
        total,
        page,
        size,
        lastPage,
      },
    };
  }

  async update(id: number, body: SongUpdateDto) {
    const existingSong = await this.db.db.query.songs.findFirst({
      where: eq(songs.id, id),
      columns: { id: true },
    });

    ensureFound(existingSong, "song not found");

    await this.db.db.update(songs).set(body).where(eq(songs.id, id));
    const updatedSong = ensureFound(
      await this.db.db.query.songs.findFirst({ where: eq(songs.id, id) }),
      "song not found",
    );

    return updatedSong;
  }

  async remove(id: number) {
    const existingSong = await this.db.db.query.songs.findFirst({
      where: eq(songs.id, id),
      columns: { id: true },
    });

    ensureFound(existingSong, "song not found");

    await this.db.db.delete(songs).where(eq(songs.id, id));
  }
}
