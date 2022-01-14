
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AtGuard } from './common/guards/at.guard';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    ClientsModule
  ],
  providers: [
    {
      provide: APP_GUARD, // set AtGuard for all routes except @SetPublicRoute
      useClass: AtGuard
    }
  ]
})

export class AppModule {}
