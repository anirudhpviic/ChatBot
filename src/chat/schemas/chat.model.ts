import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop()
  userId: string;

  @Prop()
  mood: string;

  @Prop()
  question: string;

  @Prop()
  response: string;

  @Prop()
  summary: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
