import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  providers: [
    ChatGateway,
    ChatService,
    PrismaService,
    
    JwtService,
  ],
})
export class ChatModule {}


//