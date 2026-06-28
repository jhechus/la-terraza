import { IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() slogan?: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsString() logo?: string;
  @IsOptional() @IsString() direccion?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() correo?: string;
  @IsOptional() horarios?: any;
  @IsOptional() redesSociales?: any;
  @IsOptional() @IsString() colorPrimario?: string;
  @IsOptional() @IsString() colorSecundario?: string;
  @IsOptional() @IsString() colorAcento?: string;
  @IsOptional() @IsString() metaDescripcion?: string;
  @IsOptional() @IsString() metaKeywords?: string;
  @IsOptional() @IsString() ciudad?: string;
  @IsOptional() @IsString() pais?: string;
  @IsOptional() coordenadas?: any;
}
