import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust in production
  },
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  // Map to store userId -> socketId(s)
  private readonly connectedUsers = new Map<string, string[]>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        this.logger.warn(`Connection attempt without token from ${client.id}`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub; // Assuming 'sub' is userId from JwtStrategy
      
      this.addUser(userId, client.id);
      client.data.user = payload; // Attach user data to socket

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.logger.error(`Connection unauthorized: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove user when disconnected
    if (client.data.user) {
      this.removeUser(client.data.user.sub, client.id);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Helper to extract token from handshake
  private extractToken(client: Socket): string | undefined {
    // 1. Check handshake auth object (standard socket.io)
    if (client.handshake.auth?.token) {
      return client.handshake.auth.token;
    }
    // 2. Check query params (fallback)
    if (client.handshake.query?.token) {
      return client.handshake.query.token as string;
    }
    // 3. Check headers (authorization: Bearer ...)
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    return undefined;
  }

  // Manage connected users
  private addUser(userId: string, socketId: string) {
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, []);
    }
    this.connectedUsers.get(userId)?.push(socketId);
  }

  private removeUser(userId: string, socketId: string) {
    const sockets = this.connectedUsers.get(userId);
    if (sockets) {
      const updatedSockets = sockets.filter((id) => id !== socketId);
      if (updatedSockets.length === 0) {
        this.connectedUsers.delete(userId);
      } else {
        this.connectedUsers.set(userId, updatedSockets);
      }
    }
  }

  // Public method to send notifications to a specific user
  sendNotificationToUser(userId: string, event: string, data: any) {
    const socketIds = this.connectedUsers.get(userId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit(event, data);
      });
      return true;
    }
    return false;
  }
}
