import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RTStrategy } from './strategies/rt.strategy';
import { ATStrategy } from './strategies/at.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
  imports: [JwtModule.register({}), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, ATStrategy, RTStrategy]
})
export class AuthModule { }
