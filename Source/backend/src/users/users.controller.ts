import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ActivityLoggerService } from '../logger/activity-logger.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private logger: ActivityLoggerService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Public()
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const result = await this.usersService.create(dto);
    this.logger.log('user_create', undefined, `${dto.email} (id:${result.id})`);
    return result;
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const result = await this.usersService.remove(id, req.user.id);
    this.logger.log('user_delete', req.user, `id:${id}`);
    return result;
  }
}
