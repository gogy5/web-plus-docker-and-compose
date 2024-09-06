import { Module } from '@nestjs/common';
import { createDbConfig } from './config/dbConfig';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Offer } from './offers/entities/offer.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createDbConfig,
    }),
    TypeOrmModule.forFeature([User, Wish, Wishlist, Offer]),
    AuthModule,
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
