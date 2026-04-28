import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private repo: Repository<Species>,
  ) {}

  findAll() {
    return this.repo.find({ order: { common_name: 'ASC' } });
  }

  async findOne(id: number) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException(`Вид с id=${id} не найден`);
    return s;
  }

  async create(dto: CreateSpeciesDto) {
    const existing = await this.repo.findOne({ where: { latin_name: dto.latin_name } });
    if (existing) throw new ConflictException('Вид с таким латинским названием уже существует');
    const s = this.repo.create(dto);
    return this.repo.save(s);
  }

  async update(id: number, dto: UpdateSpeciesDto) {
    const s = await this.findOne(id);
    Object.assign(s, dto);
    return this.repo.save(s);
  }

  async remove(id: number) {
    const s = await this.findOne(id);
    await this.repo.remove(s);
    return { message: 'Вид удалён' };
  }
}
