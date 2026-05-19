import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLocationDto {
  @IsOptional()
  @IsString({ message: 'Название должно быть строкой' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Адрес должен быть строкой' })
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Площадь должна быть числом' })
  @Min(0, { message: 'Площадь не может быть отрицательной' })
  area_ha?: number;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;
}
