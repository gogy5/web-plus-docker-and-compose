import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../guards/auth.guard';
import { Offer } from './entities/offer.entity';
import { OfferConfidentialDataInterceptor } from '../interceptors/offer-confidential-data-interceptor.service';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOffer(
    @Req() { user: { id } },
    @Body() createOfferDto: CreateOfferDto,
  ) {
    await this.offersService.createOfferWithBusinessConstraint(
      id,
      createOfferDto,
    );
  }

  @UseInterceptors(OfferConfidentialDataInterceptor)
  @Get()
  getAll(@Req() { user: { id } }): Promise<Offer[]> {
    const relations = ['item', 'user', 'user.wishlists'];
    return this.offersService.findAll(id, relations);
  }

  @UseInterceptors(OfferConfidentialDataInterceptor)
  @Get(':id')
  getOffer(
    @Req() { user: { id: userId } },
    @Param('id') offerId: number,
  ): Promise<Offer> {
    const relations = ['item', 'user', 'user.wishlists'];
    return this.offersService.findOneById(userId, offerId, relations);
  }
}
