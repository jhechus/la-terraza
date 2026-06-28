import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(categoriaId?: number, destacado?: boolean) {
    return this.prisma.product.findMany({
      where: {
        ...(categoriaId && { categoriaId }),
        ...(destacado !== undefined && { destacado }),
      },
      include: { categoria: { select: { id: true, nombre: true } } },
      orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
    });
  }

  findFeatured() {
    return this.prisma.product.findMany({
      where: { destacado: true, disponible: true },
      include: { categoria: { select: { id: true, nombre: true } } },
      orderBy: { orden: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { categoria: true },
    });
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
      include: { categoria: { select: { id: true, nombre: true } } },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOrFail(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { categoria: { select: { id: true, nombre: true } } },
    });
  }

  async remove(id: number) {
    await this.findOrFail(id);
    return this.prisma.product.delete({ where: { id } });
  }

  private async findOrFail(id: number) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) throw new NotFoundException(`Producto ${id} no encontrado`);
    return p;
  }
}
