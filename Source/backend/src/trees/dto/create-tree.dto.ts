import { IsInt, IsNotEmpty, IsOptional, IsIn, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTreeDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  species_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  location_id?: number;

  @IsOptional()
  @IsDateString()
  plant_date?: string;

  @IsOptional()
  @IsIn(['healthy', 'ill', 'dead'])
  health_status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
