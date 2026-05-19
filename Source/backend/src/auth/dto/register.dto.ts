import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно' })
  name: string;

  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Возраст должен быть целым числом' })
  @Min(0, { message: 'Возраст не может быть отрицательным' })
  @Max(150, { message: 'Возраст не может быть больше 150' })
  age?: number;
}
