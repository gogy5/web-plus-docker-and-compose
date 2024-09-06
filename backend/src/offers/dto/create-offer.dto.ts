import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
