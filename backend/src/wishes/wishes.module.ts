import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../offers/entities/offer.entity';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Offer]), JwtModule],
  controllers: [WishesController],
  providers: [
    WishesService,
    UsersService,
    HashService,
    JwtStrategy,
    ConfigService,
  ],
  exports: [WishesService],
})
export class WishesModule {}
