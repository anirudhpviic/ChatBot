import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true }) // Add @Prop() to define the field in MongoDB schema
  nickName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
