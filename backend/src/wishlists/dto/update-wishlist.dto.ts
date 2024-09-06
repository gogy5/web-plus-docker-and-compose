import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';
import { IsOptional } from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsOptional()
  name: string;

  @IsOptional()
  image: string;
  @IsOptional()
  itemsId: number[];

  @IsOptional()
  description: string;
}
