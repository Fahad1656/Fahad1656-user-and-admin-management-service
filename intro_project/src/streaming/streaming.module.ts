import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports:[PrismaModule,HttpModule],
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}
