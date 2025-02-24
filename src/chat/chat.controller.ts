import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/')
  async sendCompletion(@Body() body) {
    try {
      const res = await this.chatService.sendCompletion(body.userText,body.userId);
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
