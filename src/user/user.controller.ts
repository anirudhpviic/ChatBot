import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/create')
  async createUser(@Body() body) {
    try {
      const user = await this.userService.createUser(body.nickName)
      return { success: true, data: user };
    } catch (error) {
      throw new Error(error);
    }
  }
}
