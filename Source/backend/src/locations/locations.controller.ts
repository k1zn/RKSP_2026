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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ActivityLoggerService } from '../logger/activity-logger.service';

@Controller('locations')
export class LocationsController {
  constructor(
    private locationsService: LocationsService,
    private logger: ActivityLoggerService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  @Post()
  async create(@Body() dto: CreateLocationDto, @Req() req: any) {
    const result = await this.locationsService.create(dto);
    this.logger.log('location_create', req.user, `${dto.name} (id:${result.id})`);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDto,
    @Req() req: any,
  ) {
    const result = await this.locationsService.update(id, dto);
    this.logger.log('location_update', req.user, `id:${id}`);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const result = await this.locationsService.remove(id);
    this.logger.log('location_delete', req.user, `id:${id}`);
    return result;
  }
}
