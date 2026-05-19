import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsOptional,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно' })
  name: string;

  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Возраст должен быть целым числом' })
  @Min(0, { message: 'Возраст не может быть отрицательным' })
  @Max(150, { message: 'Возраст не может быть больше 150' })
  age?: number;

  @IsOptional()
  @IsString({ message: 'Пароль должен быть строкой' })
  password?: string;

  @IsOptional()
  @IsIn(['admin', 'user', 'guest'], { message: 'Недопустимая роль' })
  role?: string;
}
