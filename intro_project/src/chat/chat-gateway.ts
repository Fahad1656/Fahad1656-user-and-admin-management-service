import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { userDto } from './userDto';
import { WsAuthGuard } from './ws-auth.guard';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(socket: Socket) {
    console.log('Connection request:', socket.id);

    // Extract token from the auth object
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log('No token provided');
      socket.emit('error', { message: 'No token provided' });
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });

      const user = await this.prisma.user.findFirst({
        where: { email: payload.email },
      });

      if (!user) {
        console.log('User not found');
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }

      (socket as any).user = user;

      // Update user status and emit active users
      await this.chatService.updateUserStatus(user.id, 'online');
      const activeUsers = await this.chatService.getActiveUsers();
      console.log('Active users:', activeUsers);
      this.server.emit('usersList', activeUsers);

      console.log('New user connected:', user);
    } catch (error) {
      console.error('Error during connection:', error);
      socket.emit('error', { message: 'Invalid token' });
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log('User disconnected:', socket.id);
    const user = (socket as any).user;
    if (user) {
      await this.chatService.updateUserStatus(user.id, 'offline');
      const activeUsers = await this.chatService.getActiveUsers();
      this.server.emit('usersList', activeUsers);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: userDto,
  ) {
    console.log('Received sendMessage event from:', client.id);
    console.log('Payload:', payload);

    try {
      // Save the message using chatService
      const savedMessage = await this.chatService.create(payload);

      // Broadcast the saved message to the receiver
      this.server
        .to(`${payload.receiverId}`)
        .emit('receiveMessage', savedMessage);

      // Return success response to the sender
      return { status: 'success', message: savedMessage };
    } catch (error) {
      console.error('Error handling sendMessage:', error);

      // Return error response to the sender
      return { status: 'error', message: 'Failed to send message' };
    }
  }

  @SubscribeMessage('requestMessages')
  async handleReceiveMessage(
    @ConnectedSocket() client,
    @MessageBody() payload,
  ) {
    try {
      // const receiver = client?.user;
      // console.log(receiver);
      // console.log(client.id, 'here');
      // payload.receiverId = client?.user.id;
      const giver=payload.senderId
      const taker=payload.receiverId
      
      const messages = await this.chatService.get(giver,taker);
      console.log(messages,"oo")
      
 const messageContents = messages.map((message) => {
   return { [message.content]: [message.senderId,message.createdAt] };
 });

 //console.log(messageContentstime);
      console.log(messageContents,"kkkkk")

      console.log('Messages:', messageContents);
     
      this.server
        .to(`${payload.receiverId}`)
        .emit('receiveMessage', {
          type: 'received',
          messages: messageContents,
        });
     

      return {
        status: 'success',
        messages: [...messageContents],
       
      };
    } catch (error) {
      console.error('Error in handleReceiveMessage:', error);
      //return { status: 'error', message: 'Failed to receive messages' };
    }
  }

  
  @SubscribeMessage('testEvent')
  handleTestEvent(
    @MessageBody() data: any,
    @MessageBody() callback: (response: any) => void,
  ) {
    console.log('Received testEvent with data:', data);
    callback({ status: 'success', receivedData: data });
  }
}
