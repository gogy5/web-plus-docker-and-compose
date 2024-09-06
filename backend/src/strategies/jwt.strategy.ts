import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { BusinessException } from '../filters/utils/business-exception';
import { ErrorCode } from '../filters/utils/business-exception-description-mapping';
import * as express from 'express';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(jwtPayload: JwtPayload) {
    const user = await this.usersService.findById(jwtPayload.sub);

    if (!user) {
      throw new BusinessException(
        ErrorCode.AuthForbiddenByIncorrectCredentials,
      );
    }

    return user;
  }

  async getUserIdFromRequest(request: express.Request) {
    const jwtFromRequestFunction = ExtractJwt.fromAuthHeaderAsBearerToken();
    const jwt = jwtFromRequestFunction(request);
    if (jwt) {
      try {
        const jwtPayload: JwtPayload = await this.jwtService.verify(jwt, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        const user = await this.validate(jwtPayload);
        return user.id;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    return null;
  }
}
