import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Offer } from '../offers/entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { HashService } from '../hash/hash.service';
import { WishesService } from '../wishes/wishes.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Offer, Wishlist])],
  controllers: [UsersController],
  providers: [UsersService, HashService, WishesService],
  exports: [UsersService],
})
export class UsersModule {}
