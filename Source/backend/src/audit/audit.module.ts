import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { HealthAuditLog } from './entities/health-audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthAuditLog])],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
