import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(nickName: string) {
    const user = await (await this.userModel.create({ nickName })).save();

    return {
      greetings: `Hi ${user.nickName}`,
      introduction: `I'm Jarvis, your quirky companion ready to sprinkle some humor into your day!`,
      user,
    };
  }
}
