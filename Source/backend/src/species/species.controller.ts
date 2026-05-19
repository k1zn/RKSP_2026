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
import { SpeciesService } from './species.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ActivityLoggerService } from '../logger/activity-logger.service';

@Controller('species')
export class SpeciesController {
  constructor(
    private speciesService: SpeciesService,
    private logger: ActivityLoggerService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.speciesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.speciesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  @Post()
  async create(@Body() dto: CreateSpeciesDto, @Req() req: any) {
    const result = await this.speciesService.create(dto);
    this.logger.log('species_create', req.user, `${dto.latin_name} (id:${result.id})`);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSpeciesDto,
    @Req() req: any,
  ) {
    const result = await this.speciesService.update(id, dto);
    this.logger.log('species_update', req.user, `id:${id}`);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const result = await this.speciesService.remove(id);
    this.logger.log('species_delete', req.user, `id:${id}`);
    return result;
  }
}
