import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Получить корзину
  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  // Добавить товар
  @Post()
  addItem(@Req() req: any, @Body() body: { productId: number; quantity?: number }) {
    return this.cartService.addItem(req.user.id, body.productId, body.quantity);
  }

  // Обновить количество (PUT /cart/item/5 с body { quantity: 3 })
  @Post('item/:id')
  updateItem(@Param('id', ParseIntPipe) id: number, @Body() body: { quantity: number }) {
    return this.cartService.updateItemQuantity(id, body.quantity);
  }

  // Удалить товар из корзины
  @Delete('item/:id')
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeItem(id);
  }

  // Очистить корзину
  @Delete()
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
