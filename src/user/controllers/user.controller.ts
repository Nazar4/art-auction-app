import { Controller, Get, Logger } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }
}
