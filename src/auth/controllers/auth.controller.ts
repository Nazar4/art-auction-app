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
  public async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }
}
