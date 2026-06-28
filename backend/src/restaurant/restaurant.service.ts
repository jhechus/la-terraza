import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let restaurant = await this.prisma.restaurant.findUnique({ where: { id: 1 } });
    if (!restaurant) {
      restaurant = await this.prisma.restaurant.create({ data: { id: 1 } });
    }
    return restaurant;
  }

  async update(dto: UpdateRestaurantDto) {
    return this.prisma.restaurant.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }
}
