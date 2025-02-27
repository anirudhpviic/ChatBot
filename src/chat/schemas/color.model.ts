import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Color extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Object })
  colorPattern: Record<string, any>;
}

export const ColorSchema = SchemaFactory.createForClass(Color);
