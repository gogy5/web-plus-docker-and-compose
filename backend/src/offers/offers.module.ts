import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { User } from '../users/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';
import { Wishlist } from '../wishlists/entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish, User, Wishlist])],
  controllers: [OffersController],
  providers: [OffersService, WishesService, UsersService, HashService],
})
export class OffersModule {}
