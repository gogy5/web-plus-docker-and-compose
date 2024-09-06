import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from '../guards/local.guard';
import { User } from 'src/users/entities/user.entity';
import { UserConfidentialDataInterceptor } from '../interceptors/user-confidential-data-interceptor.service';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseInterceptors(UserConfidentialDataInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('signin')
  signin(@Req() req: Request & { user: User }) {
    return this.authService.auth(req.user);
  }
}
