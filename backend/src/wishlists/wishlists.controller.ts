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
import { WishlistsService } from './wishlists.service';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../guards/auth.guard';
import { WishlistConfidentialDataInterceptor } from '../interceptors/wishlist-confidential-data-interceptor.service';

@UseGuards(JwtGuard)
@UseInterceptors(WishlistConfidentialDataInterceptor)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  getAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Req() { user: { id: userId } },
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.createWishlist(userId, createWishlistDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  updateWishlist(
    @Req() { user: { id: userId } },
    @Param('id') wishlistId: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.updateWishlist(
      userId,
      wishlistId,
      updateWishlistDto,
    );
  }

  @Delete(':id')
  deleteWishlist(
    @Req() { user: { id: userId } },
    @Param('id') wishlistId: number,
  ): Promise<Wishlist> {
    return this.wishlistsService.removeOne(userId, wishlistId);
  }
}
