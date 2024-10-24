/* eslint-disable prettier/prettier */
// src/user/user.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';


import { createUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';
import { UserService } from './user.service';
import { verify } from 'crypto';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from 'src/common/user.gurad';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(UserGuard)
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() res) {
    return this.userService.getprofile(res.user);
  }

  @Post('register')
  async create(@Body() userData: createUserDto) {
    return this.userService.register(userData);
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() userData: updateUserDto) {
    return this.userService.updateUser(userData);
  }

  @Patch('forgetPassword')
  async generateotp(@Body() email: updateUserDto) {
    return this.userService.generateOtp(email);
  }
  @Post('verifyotp')
  async verify(@Body() data: { email: string; otp: string }) {
    return this.userService.verifyOtp(data);
  }
  @Post('reset')
  async reset(
    @Body() data: { email: string; password: string; confirmPassword: string },
  ) {
    const { email, password, confirmPassword } = data;
    return this.userService.reset(data);
  }
}
