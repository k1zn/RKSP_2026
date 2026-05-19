import { IsInt, IsOptional, IsIn, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTreeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Некорректный идентификатор вида' })
  species_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Некорректный идентификатор локации' })
  location_id?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Некорректный формат даты' })
  plant_date?: string;

  @IsOptional()
  @IsIn(['healthy', 'ill', 'dead'], { message: 'Недопустимый статус здоровья' })
  health_status?: string;

  @IsOptional()
  @IsString({ message: 'Заметки должны быть строкой' })
  notes?: string;
}
