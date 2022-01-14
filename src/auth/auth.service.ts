import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { Tokens } from './types';
import { AuthDto } from './dto/auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async generateTokens(userId: number, email: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        email,
      }, {
        secret: this.configService.get<string>('SECRET_ACCESS_TOKEN'),
        expiresIn: this.configService.get<string>('AT_TIME_EXPIRED')
      }),
      this.jwtService.signAsync({
        sub: userId,
        email,
      }, {
        secret: this.configService.get<string>('SECRET_REFRESH_TOKEN'),
        expiresIn: this.configService.get<string>('RT_TIME_EXPIRED'),
      })
    ])

    return {
      access_token,
      refresh_token
    }
  }

  private async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt)

    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        hashedRt: hash
      }
    })
  }

    // method creates tokens and saves refresh token to db
    private async createTokens(user): Promise<Tokens> {
      const tokens = await this.generateTokens(
        user.id,
        user.email
      )
  
      await this.updateRtHash(user.id, tokens.refresh_token)
  
      return tokens
    }

  async signUp(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password)

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      }
    })

    return await this.createTokens(newUser)
  }

  async signIn(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })
  
    if (!user) throw new ForbiddenException('Access Denied') // TO DO: to think about exeptions

    const passwordMatches = await bcrypt.compare(dto.password, user.hash)

    if (!passwordMatches) throw new ForbiddenException('Access Denied') // TO DO: to think about exeptions

    return await this.createTokens(user)
  }

  async signOut(id: number) {
    await this.prisma.user.update({
      where: { id, },
      data: { hashedRt: null }
    })
  }

  async refreshTokens(id: number, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt)

    if (!rtMatches) throw new ForbiddenException('Access Denied')
  
    return await this.createTokens(user)
  }
}

