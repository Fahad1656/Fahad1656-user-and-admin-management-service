import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { userDto } from './userDto';

// Initialize Redis client
const redis = new Redis({
  port: 6379, // Redis port
  host: '127.0.0.1', // Redis host
  // password: 'yourpassword', // if Redis requires authentication
});

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(payload: userDto) {
    try {
      console.log(payload);
      const message = await this.prisma.message.create({
        data: {
          senderId: payload.senderId,
          receiverId: payload.receiverId,
          content: payload.content,
        },
      });
      return message;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: number, status: 'online' | 'offline') {
    try {
      await redis.set(`user:${userId}:status`, status);
      console.log(`Updated user ${userId} status to ${status}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async getUserStatus(userId: number): Promise<'online' | 'offline'> {
    try {
      const status = await redis.get(`user:${userId}:status`);
      return status as 'online' | 'offline';
    } catch (error) {
      console.error('Error fetching user status:', error);
      throw error;
    }
  }

  async getActiveUsers(): Promise<
    { id: number; name: string; online: boolean }[]
  > {
    try {
      const users = await this.prisma.user.findMany();
      const activeUsers = await Promise.all(
        users.map(async (user) => {
          const status = await this.getUserStatus(user.id);
          return {
            id: user.id,
            name: user.name,
            online: status === 'online',
          };
        }),
      );
      return activeUsers;
    } catch (error) {
      console.error('Error fetching active users:', error);
      throw error;
    }
  }

  async get(giver:number, taker:number) {
    try {
      console.log(giver,taker);
          const messages = await this.prisma.message.findMany({
            where: {
              OR: [
                { senderId: giver, receiverId: taker },
                { senderId: taker, receiverId: giver },
              ],
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
      console.log(messages,",,,")
   
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }
}
