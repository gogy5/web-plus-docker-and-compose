import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ErrorCode } from '../filters/utils/business-exception-description-mapping';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { BusinessException } from '../filters/utils/business-exception';
import { UsersService } from '../users/users.service';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createOffer(
    createOfferDto: CreateOfferDto,
    user: User,
    wish: Wish,
    raisedSum: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Wish, createOfferDto.itemId, {
        raised: raisedSum,
      });

      const offer = await queryRunner.manager.save(Offer, {
        ...createOfferDto,
        item: wish,
        user,
      });

      await queryRunner.commitTransaction();
      return offer;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw new BusinessException(ErrorCode.OfferCreatingError);
    } finally {
      await queryRunner.release();
    }
  }

  async createOfferWithBusinessConstraint(
    userId: number,
    createOfferDto: CreateOfferDto,
  ) {
    const wish = await this.wishesService.getWishById(createOfferDto.itemId, [
      'owner',
    ]);
    if (userId === wish.owner.id) {
      throw new BusinessException(ErrorCode.OfferForbiddenByOwner);
    }

    const raisedSum = Number((wish.raised + createOfferDto.amount).toFixed(2));

    if (raisedSum > wish.price) {
      throw new BusinessException(
        ErrorCode.OfferCreatingForbiddenByAmountExcess,
      );
    }

    const user = await this.usersService.findById(userId);

    return this.createOffer(createOfferDto, user, wish, raisedSum);
  }

  async findAll(userId: number, relations: string[]) {
    return this.offersRepository.find({
      where: [{ hidden: false }, { hidden: true, user: { id: userId } }],
      relations,
    });
  }

  async findOneById(userId: number, offerId: number, relations: string[]) {
    const offer = await this.offersRepository.findOne({
      where: { id: offerId },
      relations,
    });
    const isThisHiddenOfferNorFromOwner =
      offer.hidden === true && offer.user.id !== userId;

    if (!offer || isThisHiddenOfferNorFromOwner) {
      throw new BusinessException(ErrorCode.OfferNotFound);
    }

    return offer;
  }
}
