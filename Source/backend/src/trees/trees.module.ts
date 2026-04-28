import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreesService } from './trees.service';
import { TreesController } from './trees.controller';
import { Tree } from './entities/tree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tree])],
  controllers: [TreesController],
  providers: [TreesService],
})
export class TreesModule {}
