import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('fecha') fecha?: string, @Query('estado') estado?: string) {
    return this.reservationsService.findAll(fecha, estado);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.reservationsService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReservationDto) {
    return this.reservationsService.update(id, dto);
  }
}
