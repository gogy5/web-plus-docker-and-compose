import { IsNumber, IsString, IsUrl, Length } from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, ManyToOne, OneToMany, Entity } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  getCopy(copyOwner: User): Wish {
    const newWish = new Wish();
    newWish.name = this.name;
    newWish.link = this.link;
    newWish.image = this.image;
    newWish.price = this.price;
    newWish.description = this.description;
    newWish.owner = copyOwner;
    return newWish;
  }

  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'float' })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ type: 'float', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({ default: '' })
  @Length(1, 1024)
  @IsString()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    type: 'int',
    default: 0,
  })
  @IsNumber()
  copied: number;
}
