import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';

import { RtGuard } from '../../core/guards/rt.guard';
import { GetCurrentUser, GetCurrentUserId, SetPublicRoute } from '../../core/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

// TO DO: add email confirmation
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('test')
  test(@GetCurrentUserId() id) {
    return 'test'
  }

  @SetPublicRoute()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() dto: AuthDto): Promise<Tokens> {
    try {
      return this.authService.signUp(dto)
    } catch (error) {
      console.log(error)
      return error
    }
    
  }

  @SetPublicRoute()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signIn(dto)
  }

  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  signOut(@GetCurrentUserId() id: number) {
    return this.authService.signOut(id)
  }

  @SetPublicRoute()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ) {
    return this.authService.refreshTokens(userId, refreshToken)
  }
}
