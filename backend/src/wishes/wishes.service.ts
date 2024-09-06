import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { BusinessException } from '../filters/utils/business-exception';
import { ErrorCode } from '../filters/utils/business-exception-description-mapping';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Offer } from '../offers/entities/offer.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createWish(
    userId: number,
    createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return this.wishesRepository.save({
      ...createWishDto,
      owner: { id: userId },
    });
  }

  async getWishById(wishId: number, relations?: string[]) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations,
    });

    if (!wish) {
      throw new BusinessException(ErrorCode.WishNotFound);
    }

    return wish;
  }

  async findWishesByUserId(
    userId: number,
    relations: string[],
    currentUserId?: number,
  ) {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id: userId } },
      relations,
    });

    return this.filterWishesHiddenOffersByOwner(
      currentUserId || userId,
      wishes,
    );
  }

  async findUserWishesByUsername(
    currentUserId: number,
    username: string,
    relations: string[],
  ) {
    const { id } = await this.usersService.findByUsername(username);
    return this.findWishesByUserId(id, relations, currentUserId);
  }

  async findLastWishesTakingIntoUserAuthorization(userId?: number) {
    const relations = ['owner'];
    const isAuthorizedUser = !!userId;

    if (isAuthorizedUser) {
      return this.findLastWishesForAuthorizedUser(userId, relations);
    } else {
      return this.findLastWishes(relations);
    }
  }

  async findLastWishesForAuthorizedUser(userId, relations: string[]) {
    relations.push('offers', 'offers.user');
    const wishes = await this.findLastWishes(relations);
    return this.filterWishesHiddenOffersByOwner(userId, wishes);
  }

  async findLastWishes(relations: string[]) {
    return await this.wishesRepository.find({
      relations,
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async findTopWishesTakingIntoUserAuthorization(userId?: number) {
    const relations = ['owner'];
    const isAuthorizedUser = !!userId;

    if (isAuthorizedUser) {
      return this.findTopWishesForAuthorizedUser(userId, relations);
    } else {
      return this.findTopWishes(relations);
    }
  }

  async findTopWishesForAuthorizedUser(userId, relations: string[]) {
    relations.push('offers', 'offers.user');
    const wishes = await this.findTopWishes(relations);
    return this.filterWishesHiddenOffersByOwner(userId, wishes);
  }

  async findTopWishes(relations: string[]) {
    return await this.wishesRepository.find({
      relations,
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  async getWish(userId: number, wishId: number) {
    const wish = await this.getWishById(wishId, [
      'owner',
      'offers',
      'offers.user',
    ]);

    if (!wish) {
      throw new BusinessException(ErrorCode.WishNotFound);
    }

    wish.offers = this.filterHiddenOffersByOwner(userId, wish.offers);
    return wish;
  }

  async updateWish(
    userId: number,
    wishId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<void> {
    const wish = await this.getWishById(wishId, ['owner', 'offers']);

    if (wish.offers.length !== 0) {
      throw new BusinessException(
        ErrorCode.WishUpdatingForbiddenByExistingOffers,
      );
    }

    if (wish.owner.id !== userId) {
      throw new BusinessException(ErrorCode.WishUpdatingForbiddenByOwner);
    }

    const updatedWishResult = await this.wishesRepository.update(wishId, {
      price: updateWishDto.price,
      description: updateWishDto.description,
    });
    if (updatedWishResult.affected === 0) {
      throw new BusinessException(ErrorCode.WishUpdatingError);
    }
  }

  async removeOne(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.getWishById(wishId, [
      'owner',
      'offers',
      'offers.user',
    ]);

    if (userId !== wish.owner.id) {
      throw new BusinessException(ErrorCode.WishDeletingForbiddenByOwner);
    }

    await this.wishesRepository.delete(wishId);
    wish.offers = this.filterHiddenOffersByOwner(userId, wish.offers);

    return wish;
  }

  async copyWish(userId: number, wishId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const copiedWish = await this.getWishById(wishId);
      const user = await this.usersService.findById(userId);
      const newWish = copiedWish.getCopy(user);
      await queryRunner.manager.save(newWish);

      await queryRunner.manager.update(Wish, wishId, {
        copied: copiedWish.copied + 1,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BusinessException(ErrorCode.WishCopyingError);
    } finally {
      await queryRunner.release();
    }
  }

  async getWishesByIds(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      where: {
        id: In(ids),
      },
    });

    if (wishes.length === 0) {
      throw new BusinessException(ErrorCode.WishesNotFound);
    }

    return wishes;
  }

  filterHiddenOffersByOwner(userId: number, offers: Offer[]): Offer[] {
    return offers.filter((offer) => {
      return (
        offer.hidden === false ||
        (offer.hidden === true && offer.user.id === userId)
      );
    });
  }

  filterWishesHiddenOffersByOwner(userId: number, wishes: Wish[]): Wish[] {
    return wishes.map((wish) => {
      wish.offers = this.filterHiddenOffersByOwner(userId, wish.offers);
      return wish;
    });
  }
}
