import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Получить корзину пользователя (или создать, если нет)
  async getCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({ 
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }
    return cart;
  }

  // Добавить товар в корзину
async addItem(userId: number, productId: any, quantity: number = 1) {
  const cart = await this.getCart(userId);
  const pid = Number(productId);
  const existingItem = await this.prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: pid },
  });
  if (existingItem) {
    return this.prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }
  return this.prisma.cartItem.create({
    data: { cartId: cart.id, productId: pid, quantity },
  });
}

  // Обновить количество товара
  async updateItemQuantity(itemId: number, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  // Удалить товар из корзины
  async removeItem(itemId: number) {
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  // Очистить корзину
  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }

  // Узнать общую стоимость корзины
  async getTotal(userId: number) {
    const cart = await this.getCart(userId);
    let total = 0;
    for (const item of cart.items) {
      total += item.product.price * item.quantity;
    }
    return total;
  }
}