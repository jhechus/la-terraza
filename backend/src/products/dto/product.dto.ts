import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsOptional() @IsString() descripcion?: string;
  @Type(() => Number) @IsNumber() @Min(0) precio: number;
  @IsOptional() @IsString() imagen?: string;
  @IsOptional() @IsBoolean() disponible?: boolean;
  @IsOptional() @IsBoolean() destacado?: boolean;
  @IsOptional() @IsNumber() orden?: number;
  @Type(() => Number) @IsNumber() @IsNotEmpty() categoriaId: number;
}

export class UpdateProductDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) precio?: number;
  @IsOptional() @IsString() imagen?: string;
  @IsOptional() @IsBoolean() disponible?: boolean;
  @IsOptional() @IsBoolean() destacado?: boolean;
  @IsOptional() @IsNumber() orden?: number;
  @IsOptional() @Type(() => Number) @IsNumber() categoriaId?: number;
}
