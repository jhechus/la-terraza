import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateReservationDto) {
    return this.prisma.reservation.create({
      data: {
        ...dto,
        fecha: new Date(dto.fecha),
        personas: Number(dto.personas),
      },
    });
  }

  findAll(fecha?: string, estado?: string) {
    return this.prisma.reservation.findMany({
      where: {
        ...(fecha && { fecha: new Date(fecha) }),
        ...(estado && { estado: estado as any }),
      },
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
    });
  }

  async findOne(id: number) {
    const r = await this.prisma.reservation.findUnique({ where: { id } });
    if (!r) throw new NotFoundException(`Reserva ${id} no encontrada`);
    return r;
  }

  async update(id: number, dto: UpdateReservationDto) {
    await this.findOne(id);
    return this.prisma.reservation.update({ where: { id }, data: dto });
  }

  async getStats() {
    const [total, pendientes, confirmadas, hoy] = await Promise.all([
      this.prisma.reservation.count(),
      this.prisma.reservation.count({ where: { estado: 'PENDIENTE' } }),
      this.prisma.reservation.count({ where: { estado: 'CONFIRMADA' } }),
      this.prisma.reservation.count({
        where: { fecha: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
    ]);
    return { total, pendientes, confirmadas, hoy };
  }
}
