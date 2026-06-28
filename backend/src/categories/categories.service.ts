import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { orden: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { disponible: true },
          orderBy: { orden: 'asc' },
        },
      },
    });
  }

  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOrFail(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOrFail(id);
    return this.prisma.category.delete({ where: { id } });
  }

  private async findOrFail(id: number) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return cat;
  }
}
