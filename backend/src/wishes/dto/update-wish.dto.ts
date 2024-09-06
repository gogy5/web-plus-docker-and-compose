import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ForbiddenToChange } from '../../validators/forbidden-to-change.validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

export class UpdateWishDto {
  @ForbiddenToChange()
  name: string;

  @ForbiddenToChange()
  link: string;

  @ForbiddenToChange()
  image: string;

  @ForbiddenToChange()
  raised: string;

  @ForbiddenToChange()
  owner: User;

  @ForbiddenToChange()
  offers: Offer[];

  @ForbiddenToChange()
  copied: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsOptional()
  @IsString()
  @Length(1, 1024)
  description: string;
}
