import { Tokens } from './../../types/tokens.types';
import { AuthService } from '../../auth.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { Test } from '@nestjs/testing';
import { AuthDto } from '../../dto';
import { ForbiddenException } from '@nestjs/common';

const newUser: AuthDto = {
  email: "test@mail.com",
  password: "123123123"
}

describe('AuthService Int', () => {
  let prisma: PrismaService
  let authService: AuthService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);

    await prisma.cleanDatabase()
  })

  it('should sign up new user', async () => {
    const tokens = await authService.signUp(newUser)

    expect(tokens.access_token.length).not.toEqual(0)

    expect(typeof tokens.access_token).toBe('string')
    expect(typeof tokens.refresh_token).toBe('string')    
  })

  it('create duplicate', async () => {
    await expect(authService.signUp(newUser)).rejects.toThrowError(ForbiddenException)
  })

  it.todo('should pass');
})
