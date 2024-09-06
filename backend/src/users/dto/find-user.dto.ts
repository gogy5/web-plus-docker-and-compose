import { IsString, Length } from 'class-validator';

export class FindUserDto {
  @IsString()
  @Length(1)
  query: string;
}
