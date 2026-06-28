import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsOptional() @IsString() icono?: string;
  @IsOptional() @IsNumber() orden?: number;
  @IsOptional() @IsBoolean() activa?: boolean;
}

export class UpdateCategoryDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() icono?: string;
  @IsOptional() @IsNumber() orden?: number;
  @IsOptional() @IsBoolean() activa?: boolean;
}
