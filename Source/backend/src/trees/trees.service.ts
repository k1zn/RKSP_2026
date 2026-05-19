import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tree } from './entities/tree.entity';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';

@Injectable()
export class TreesService {
  constructor(
    @InjectRepository(Tree)
    private repo: Repository<Tree>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['species', 'location'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const tree = await this.repo.findOne({
      where: { id },
      relations: ['species', 'location'],
    });
    if (!tree) throw new NotFoundException(`Дерево с id=${id} не найдено`);
    return tree;
  }

  async create(dto: CreateTreeDto) {
    const tree = this.repo.create(dto as any);
    const saved = (await this.repo.save(tree)) as unknown as Tree;
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateTreeDto) {
    const tree = await this.repo.findOne({ where: { id } });
    if (!tree) throw new NotFoundException(`Дерево с id=${id} не найдено`);
    Object.assign(tree, dto);
    return this.repo.save(tree);
  }

  async remove(id: number) {
    const tree = await this.repo.findOne({ where: { id } });
    if (!tree) throw new NotFoundException(`Дерево с id=${id} не найдено`);
    await this.repo.remove(tree);
    return { message: 'Дерево удалено' };
  }
}
