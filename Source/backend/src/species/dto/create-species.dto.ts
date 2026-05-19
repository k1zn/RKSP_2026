import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSpeciesDto {
  @IsString({ message: 'Латинское название должно быть строкой' })
  @IsNotEmpty({ message: 'Латинское название обязательно' })
  latin_name: string;

  @IsString({ message: 'Русское название должно быть строкой' })
  @IsNotEmpty({ message: 'Русское название обязательно' })
  common_name: string;

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
