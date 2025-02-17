import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  async check() {
    return `Server Up And Running On Port ${process.env.PORT}`;
  }
}
