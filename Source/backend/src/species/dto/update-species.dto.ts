import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSpeciesDto {
  @IsOptional()
  @IsString({ message: 'Латинское название должно быть строкой' })
  latin_name?: string;

  @IsOptional()
  @IsString({ message: 'Русское название должно быть строкой' })
  common_name?: string;

  @IsOptional()
  @IsString({ message: 'Семейство должно быть строкой' })
  family?: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Высота должна быть числом' })
  @Min(0, { message: 'Высота не может быть отрицательной' })
  max_height_m?: number;
}
