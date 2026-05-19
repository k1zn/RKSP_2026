import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.repo.find();
    return users.map(({ password_hash, ...u }) => u);
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Пользователь с id=${id} не найден`);
    const { password_hash, ...rest } = user;
    return rest;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email уже используется');

    const password_hash = await bcrypt.hash(dto.password || 'changeme', 10);
    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      age: dto.age ?? null,
      role: (dto.role as any) ?? 'user',
      password_hash,
    });
    const saved = await this.repo.save(user);
    const { password_hash: _, ...result } = saved;
    return result;
  }

  async remove(id: number, currentUserId: number) {
    if (id === currentUserId) throw new ForbiddenException('Нельзя удалить собственный аккаунт');
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Пользователь с id=${id} не найден`);
    if (user.role === 'admin') throw new ForbiddenException('Нельзя удалить администратора');
    await this.repo.remove(user);
    return { message: 'Пользователь удалён' };
  }
}
