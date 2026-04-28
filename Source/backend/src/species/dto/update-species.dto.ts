import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSpeciesDto {
  @IsOptional()
  @IsString()
  latin_name?: string;

  @IsOptional()
  @IsString()
  common_name?: string;

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
