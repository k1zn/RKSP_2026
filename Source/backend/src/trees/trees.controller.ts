import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TreesService } from './trees.service';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ActivityLoggerService } from '../logger/activity-logger.service';

@Controller('trees')
export class TreesController {
  constructor(
    private treesService: TreesService,
    private logger: ActivityLoggerService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.treesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.treesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  @Post()
  async create(@Body() dto: CreateTreeDto, @Req() req: any) {
    const result = await this.treesService.create(dto);
    this.logger.log('tree_create', req.user, `id:${result.id}`);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTreeDto,
    @Req() req: any,
  ) {
    const result = await this.treesService.update(id, dto);
    this.logger.log('tree_update', req.user, `id:${id}`);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const result = await this.treesService.remove(id);
    this.logger.log('tree_delete', req.user, `id:${id}`);
    return result;
  }
}
