import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from '../wishes/wishes.service';
import { ErrorCode } from '../filters/utils/business-exception-description-mapping';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { BusinessException } from '../filters/utils/business-exception';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async createWishlist(userId: number, createWishlistDto: CreateWishlistDto) {
    try {
      const { itemsId, ...createWishlistDtoRest } = createWishlistDto;

      const items = await this.wishesService.getWishesByIds(itemsId);
      const owner = await this.usersService.findById(userId);

      return await this.wishlistsRepository.save({
        ...createWishlistDtoRest,
        items,
        owner,
      });
    } catch (e) {
      console.error(e);
      throw new BusinessException(ErrorCode.WishlistCreatingError);
    }
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new BusinessException(ErrorCode.WishlistNotFound);
    }

    return wishlist;
  }

  async updateWishlist(
    userId: number,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findOne(wishlistId);

    if (userId !== wishlist.owner.id) {
      throw new BusinessException(ErrorCode.WishlistUpdatingForbiddenByOwner);
    }

    const updateWishlistResult = await this.wishlistsRepository.update(
      wishlistId,
      updateWishlistDto,
    );

    if (updateWishlistResult.affected === 0) {
      throw new BusinessException(ErrorCode.WishlistNotFound);
    }

    return this.findOne(wishlistId);
  }

  async removeOne(userId: number, wishlistId: number) {
    const wishlist = await this.findOne(wishlistId);

    if (userId !== wishlist.owner.id) {
      throw new BusinessException(ErrorCode.WishlistDeletingForbiddenByOwner);
    }
    await this.wishlistsRepository.delete(wishlistId);
    return wishlist;
  }
}
