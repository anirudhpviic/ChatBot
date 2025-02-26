import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop()
  userId: string;

  @Prop()
  userInput: string;

  @Prop()
  response: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
