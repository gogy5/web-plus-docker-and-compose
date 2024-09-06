import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish, User])],
  controllers: [WishlistsController],
  providers: [WishlistsService, WishesService, UsersService, HashService],
})
export class WishlistsModule {}
