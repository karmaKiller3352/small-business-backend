
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './routes/auth/auth.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { AtGuard } from './core/guards/at.guard';
import { ClientsModule } from './routes/clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
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
