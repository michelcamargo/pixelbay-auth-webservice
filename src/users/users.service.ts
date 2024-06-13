import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.authUser.create({ data });
  }

  async findAll() {
    return this.prisma.authUser.findMany();
  }

  async findOne(id: number) {
    return this.prisma.authUser.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.authUser.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.authUser.delete({ where: { id } });
  }
}
