import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;
    
    if (!token) {
      throw new UnauthorizedException();
    }

    token = token.slice(7);
    let data: any = jwt.decode(token);
    
    const user = await this.prisma.user.findFirst({
      where: { email:data.email},
    });
   

    if (user){
        return true
    }

    throw new UnauthorizedException({
      success: false,
      verified: false,
      message: 'You are not authorized to access this service',
    });
  }
}
