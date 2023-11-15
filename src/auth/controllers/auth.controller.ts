import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { AuthGuardJwt } from '../guards/auth-guard.jwt';
import { AuthGuardLocal } from '../guards/auth-guard.local';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile-info')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }
}
