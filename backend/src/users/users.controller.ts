import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/auth.guard';
import { UserConfidentialDataInterceptor } from '../interceptors/user-confidential-data-interceptor.service';
import { User } from './entities/user.entity';
import { WishConfidentialDataInterceptor } from '../interceptors/wish-confidential-data-interceptor.service';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseInterceptors(UserConfidentialDataInterceptor)
  @Get('me')
  getCurrentUser(@Req() { user: { id: userId } }): Promise<User> {
    return this.usersService.findById(userId);
  }

  @UseInterceptors(UserConfidentialDataInterceptor)
  @Patch('me')
  updateUser(
    @Req() { user: { id: userId } },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @UseInterceptors(WishConfidentialDataInterceptor)
  @Get('me/wishes')
  findCurrentUserWishes(@Req() { user: { id: userId } }): Promise<Wish[]> {
    const relations = ['owner', 'offers', 'offers.user'];
    return this.wishesService.findWishesByUserId(userId, relations);
  }

  @UseInterceptors(UserConfidentialDataInterceptor)
  @Get(':username')
  getUser(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @UseInterceptors(WishConfidentialDataInterceptor)
  @Get(':username/wishes')
  findUserWishes(
    @Req() { user: { id: userId } },
    @Param('username') username: string,
  ): Promise<Wish[]> {
    const relations = ['offers', 'offers.user'];
    return this.wishesService.findUserWishesByUsername(
      userId,
      username,
      relations,
    );
  }

  @UseInterceptors(UserConfidentialDataInterceptor)
  @Post('find')
  findByQuery(@Body() findUserDto: FindUserDto): Promise<User[]> {
    return this.usersService.findByUsernameOrEmail(findUserDto.query);
  }
}
