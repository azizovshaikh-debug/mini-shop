import { Controller, Get, Post, Param, Body, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Оформить заказ
 @Post()
createOrder(@Req() req: any, @Body() body: { address?: string; phone?: string; comment?: string }) {
  return this.ordersService.createOrder(req.user.id, body.address, body.phone, body.comment);
}

  // Мои заказы
  @Get('my')
  getUserOrders(@Req() req: any) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  // Все заказы (только админ)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // Обновить статус заказа (только админ)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}