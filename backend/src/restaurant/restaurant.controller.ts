import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get()
  get() {
    return this.restaurantService.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() dto: UpdateRestaurantDto) {
    return this.restaurantService.update(dto);
  }
}
