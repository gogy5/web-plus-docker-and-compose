import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../hash/hash.service';
import { ErrorCode } from '../filters/utils/business-exception-description-mapping';
import { BusinessException } from '../filters/utils/business-exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userWithHash =
        await this.hashService.getUserWithHashedPassword<CreateUserDto>(
          createUserDto,
        );
      return await this.usersRepository.save(userWithHash);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new BusinessException(ErrorCode.UserAlreadyExists);
      }

      throw new BusinessException(ErrorCode.UserCreatingError);
    }
  }

  async findById(id: number): Promise<User> {
    const currentUser = await this.usersRepository.findOneBy({ id });

    if (!currentUser) {
      throw new BusinessException(ErrorCode.UserNotFound);
    }

    return currentUser;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new BusinessException(ErrorCode.UserNotFound);
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hashPassword(
        updateUserDto.password,
      );
    }

    const updateUserResult = await this.usersRepository.update(
      id,
      updateUserDto,
    );
    if (updateUserResult.affected === 0) {
      throw new BusinessException(ErrorCode.UserUpdatingError);
    }

    return this.findById(id);
  }

  async findByUsernameOrEmail(query: string) {
    return await this.usersRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }
}
