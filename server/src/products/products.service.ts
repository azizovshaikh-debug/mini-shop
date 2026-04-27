import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Создать товар
  create(data: { name: string; description: string; price: number; imageUrl: string; category: string }) {
    return this.prisma.product.create({ data });
  }

  // Все товары
  findAll() {
    return this.prisma.product.findMany();
  }

  // Один товар по ID
  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  // Обновить товар
  update(id: number, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  // Удалить товар
  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}