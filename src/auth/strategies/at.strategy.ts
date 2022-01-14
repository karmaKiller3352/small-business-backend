import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class ATStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor( configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('SECRET_ACCESS_TOKEN')
    })
  }

  validate(payload: any) {
    return payload;
  }
}