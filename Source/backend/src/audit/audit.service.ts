import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthAuditLog } from './entities/health-audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(HealthAuditLog)
    private repo: Repository<HealthAuditLog>,
  ) {}

  findAll() {
    return this.repo.find({ order: { changed_at: 'DESC' } });
  }
}
