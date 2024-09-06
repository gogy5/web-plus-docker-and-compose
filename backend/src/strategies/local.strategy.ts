import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { BusinessException } from '../filters/utils/business-exception';
import { ErrorCode } from '../filters/utils/business-exception-description-mapping';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new BusinessException(
        ErrorCode.AuthForbiddenByIncorrectCredentials,
      );
    }
    return user;
  }
}
