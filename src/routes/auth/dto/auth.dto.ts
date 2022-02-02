import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class AuthDto {
  // @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  // @Length(6, 12)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
  password: string;
}