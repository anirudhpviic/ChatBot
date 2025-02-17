import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [CoreModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
