import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { createAdminDto } from './dto/createAdminDto';
import { createPostDto } from './dto/createPostDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
//@UseGuards(RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('register')
  async create(@Body() adminData: createAdminDto) {
    return this.adminService.register(adminData);
  }
  @Post('create/userpost')
  @UseGuards(AuthGuard('jwt'))
  async insert(@Body() data: createPostDto) {
    return this.adminService.insert(data);
  }
  @Get('getuser/:id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    return this.adminService.findUserById(+id);
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    return this.adminService.getAll();
  }
  @Patch('update/user/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Body() body: any, @Param('id') id: number) {
    return this.adminService.updateUser(body, +id);
  }
  @Delete('delete/user/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(+id);
  }
}
