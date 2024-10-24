import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>(); // Ensure correct type

    // Extract token from the auth property
    const token = client.handshake.auth.token as string;

    if (!token) {
      client.emit('error', { message: 'Authentication token not provided!' });
      return false;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });

      const user = await this.prisma.user.findFirst({
        where: { email: payload.email },
      });

      if (!user) {
        client.emit('error', { message: 'Unauthorized' });
        return false;
      }

      client['user'] = user; // Attach user to client (type assertion required)
      return true;
    } catch (error) {
      console.error('Error during authentication:', error);
      client.emit('error', { message: 'Invalid token' });
      return false;
    }
  }
}
