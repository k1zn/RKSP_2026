import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ActivityLoggerService } from '../logger/activity-logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private logger: ActivityLoggerService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      this.logger.log('login_failed', undefined, `email: ${dto.email}`);
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) {
      this.logger.log('login_failed', undefined, `email: ${dto.email}`);
      throw new UnauthorizedException('Неверный email или пароль');
    }

    this.logger.log('login', { id: user.id, email: user.email, role: user.role });
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email уже используется');

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      age: dto.age ?? null,
      role: 'user',
      password_hash,
    });
    const saved = await this.usersRepo.save(user);

    this.logger.log('register', { id: saved.id, email: saved.email, role: saved.role });
    const payload = { sub: saved.id, email: saved.email, role: saved.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: saved.id,
        name: saved.name,
        email: saved.email,
        role: saved.role,
      },
    };
  }
}
