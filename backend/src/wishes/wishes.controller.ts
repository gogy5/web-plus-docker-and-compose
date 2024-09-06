import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from '../guards/auth.guard';
import { Wish } from './entities/wish.entity';
import { WishConfidentialDataInterceptor } from '../interceptors/wish-confidential-data-interceptor.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createWish(
    @Req() { user: { id } },
    @Body() createWishDto: CreateWishDto,
  ): Promise<void> {
    await this.wishesService.createWish(id, createWishDto);
  }

  @UseInterceptors(WishConfidentialDataInterceptor)
  @Get('last')
  async getLastWishes(@Req() req): Promise<Wish[]> {
    const userId = await this.jwtStrategy.getUserIdFromRequest(req);
    return this.wishesService.findLastWishesTakingIntoUserAuthorization(userId);
  }

  @UseInterceptors(WishConfidentialDataInterceptor)
  @Get('top')
  async getTopWishes(@Req() req): Promise<Wish[]> {
    const userId = await this.jwtStrategy.getUserIdFromRequest(req);
    return this.wishesService.findTopWishesTakingIntoUserAuthorization(userId);
  }

  @UseInterceptors(WishConfidentialDataInterceptor)
  @UseGuards(JwtGuard)
  @Get(':id')
  getWishById(
    @Req() { user: { id } },
    @Param('id') wishId: number,
  ): Promise<Wish> {
    return this.wishesService.getWish(id, wishId);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateWish(
    @Param('id') wishId: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() res: Response & { user: User },
  ): Promise<void> {
    await this.wishesService.updateWish(res.user.id, wishId, updateWishDto);
  }

  @UseInterceptors(WishConfidentialDataInterceptor)
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWish(@Param('id') wishId: number, @Req() { user: { id } }) {
    return this.wishesService.removeOne(wishId, id);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(':id/copy')
  async copyWish(@Req() { user: { id } }, @Param('id') wishId: number) {
    await this.wishesService.copyWish(id, wishId);
  }
}
