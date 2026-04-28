import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSpeciesDto {
  @IsString()
  @IsNotEmpty()
  latin_name: string;

  @IsString()
  @IsNotEmpty()
  common_name: string;

  @IsOptional()
  @IsString()
  family?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_height_m?: number;
}
