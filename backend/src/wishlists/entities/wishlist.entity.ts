import { Length, IsUrl, IsString } from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @Length(1, 1500)
  @IsString()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
