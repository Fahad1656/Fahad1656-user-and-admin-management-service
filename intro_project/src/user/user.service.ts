// src/user/user.service.ts


import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { MailService } from 'utils/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { createUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';


import Redis from 'ioredis';

const redis = new Redis({
  port: 6379, // Redis port
  host: '127.0.0.1', // Redis host
  // password: 'yourpassword', // if Redis requires authentication
});

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,

  ) {}

  async getprofile(user: any) {
   // console.log('User in getprofile:', user.payload.name); 
    //return this.prisma.user.findMany();
    

    const profile = await this.prisma.user.findFirst({
      where: { 
        id:user.payload.id,
        email:user.payload.email,
      },
      include: {
        posts: true,
      },
    });
    //console.log(profile, 'fetched profile');

    return {
      status: 'success',
      message: 'Here is the details',
      user: profile,
    };
  }

  async register(data: createUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    console.log(hashedPassword);
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(data: updateUserDto) {
    // Check if user exists before attempting to update
    console.log(data);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with email ${data.email} not found.`);
    } else {
      if (!data.password) {
        const updatedInfo = await this.prisma.user.update({
          where: { email: data.email },
          data,
        });
        if (updatedInfo) {
          return {
            status: 'success',
            message: 'updated the information successfully',
            data: data,
          };
        } else {
          return {
            status: 'unsuccessful',
            message: 'cant not update the information',
            data: data,
          };
        }
      } else {
        throw new NotFoundException(`password  Can't be changed.`);
      }
    }
  }
  async generateOtp(email: updateUserDto) {
    // Check if user exists
    console.log(email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.email }, // Corrected syntax: where: { email: email }
    });

    if (!existingUser) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    function generateRandomNumber(): number {
      return Math.floor(100000 + Math.random() * 900000);
    }

    const otpNumber = generateRandomNumber();

    // Save OTP to cache
    await redis.set('otp', otpNumber.toString());
    const storedotp = await redis.get('otp');
    console.log(redis.get('otp'), 'fah');
    console.log(storedotp);

    // Send email with OTP
    try {
      this.mailService.sendEmail(email.email, otpNumber.toString());
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending email:', error);
      throw new Error('Failed to send email');
    }

    return {
      status: 'success',
      otp: otpNumber.toString(),
    };
  }

  async verifyOtp(data: {
    otp: string;
    email: string;
  }): Promise<{ status: string; message: string }> {
    const { otp, email } = data;

    try {
      // Retrieve OTP from cache
      const otpCodeFromCache = await redis.get(`otp`);

      // Verify OTP
      if (!otpCodeFromCache || otp !== otpCodeFromCache) {
        throw new NotFoundException('Invalid OTP.');
      } else {
        await redis.del('otp');
        return {
          status: 'success',
          message: 'OTP verified successfully',
        };
      }
    } catch (error) {
      throw new Error(`OTP verification failed: ${error.message}`);
    }
  }

  async reset(data: {
    email:string;
    password: string;
    confirmPassword: string;
  }): Promise<{ status: string; message: string }> {
    const { password, confirmPassword, email } = data;

  if (password !== confirmPassword) {
    throw new BadRequestException('Passwords do not match.');
  }

  try {
    // Generate hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with email ${email} not found. Password reset failed.`);
    }

    // Clear OTP from cache after successful reset
    await redis.del(`otp:${email}`);

    return {
      status: 'success',
      message: 'Password reset successful',
    };
  } catch (error) {
    throw new Error(`Password reset failed: ${error.message}`);
  }
  }
  
}
