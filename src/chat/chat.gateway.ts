import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Allow all origins for simplicity
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log('A user connected:', client.id);
    }
  
    handleDisconnect(client: Socket) {
      console.log('User disconnected:', client.id);
    }
  
    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any) {
      console.log('Message received:', payload);
        this.server.emit("hi",{data:"done"})
    }
  }