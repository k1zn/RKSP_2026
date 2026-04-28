import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private repo: Repository<Location>,
  ) {}

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const loc = await this.repo.findOne({ where: { id } });
    if (!loc) throw new NotFoundException(`Локация с id=${id} не найдена`);
    return loc;
  }

  create(dto: CreateLocationDto) {
    const loc = this.repo.create(dto);
    return this.repo.save(loc);
  }

  async update(id: number, dto: UpdateLocationDto) {
    const loc = await this.findOne(id);
    Object.assign(loc, dto);
    return this.repo.save(loc);
  }

  async remove(id: number) {
    const loc = await this.findOne(id);
    await this.repo.remove(loc);
    return { message: 'Локация удалена' };
  }
}
