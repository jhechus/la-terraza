import { ReservationStatus } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReservationDto {
  @IsString() @IsNotEmpty() nombreCliente: string;
  @IsString() @IsNotEmpty() telefono: string;
  @IsOptional() @IsEmail() correo?: string;
  @IsDateString() fecha: string;
  @IsString() @IsNotEmpty() hora: string;
  @IsInt() @Min(1) @Max(20) personas: number;
  @IsOptional() @IsString() comentarios?: string;
}

export class UpdateReservationDto {
  @IsOptional() @IsEnum(ReservationStatus) estado?: ReservationStatus;
  @IsOptional() @IsString() notaAdmin?: string;
  @IsOptional() @IsString() hora?: string;
  @IsOptional() @IsInt() @Min(1) @Max(20) personas?: number;
}
