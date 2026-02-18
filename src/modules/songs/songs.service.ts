import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SongCreateInput, SongUpdateInput } from './dto/songs.schema';

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) {}

  create(body: SongCreateInput) {
    return this.prisma.song.create({ data: body });
  }

  findAll() {
    return this.prisma.song.findMany({ orderBy: { id: 'desc' } });
  }

  update(id: number, body: SongUpdateInput) {
    return this.prisma.song.update({ where: { id }, data: body });
  }

  remove(id: number) {
    return this.prisma.song.delete({ where: { id } }).then(() => undefined);
  }
}