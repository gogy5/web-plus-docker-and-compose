import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Offer } from '../offers/entities/offer.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';

export const createDbConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USERNAME'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [User, Offer, Wish, Wishlist],
    synchronize: configService.get('POSTGRES_SYNCHRONIZE'),
  };
};
