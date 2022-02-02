
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AllExceptionsFilter } from 'src/core/exeptions/ExeptionFilter';
import { RTStrategy } from './strategies/rt.strategy';
import { ATStrategy } from './strategies/at.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    ATStrategy,
    RTStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ]
})
export class AuthModule { }
