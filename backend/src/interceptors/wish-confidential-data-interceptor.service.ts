import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Wish } from '../wishes/entities/wish.entity';
import { deleteConfidentialDataFromOffers } from './offer-confidential-data-interceptor.service';
import { deleteConfidentialDataFromUser } from './user-confidential-data-interceptor.service';

@Injectable()
export class WishConfidentialDataInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<Wish | Wish[]>,
  ): Observable<Wish | Wish[]> {
    return next.handle().pipe(map(deleteConfidentialDataFromWishData));
  }
}

function deleteConfidentialDataFromWishData(
  data: Wish | Wish[],
): Wish | Wish[] {
  if (Array.isArray(data)) {
    return deleteConfidentialDataFromWishes(data);
  } else {
    return deleteConfidentialDataFromWish(data);
  }
}

function deleteConfidentialDataFromWishes(wishes: Wish[]): Wish[] {
  return wishes.map(deleteConfidentialDataFromWish);
}

function deleteConfidentialDataFromWish(wish: Wish): Wish {
  if (wish.owner) {
    wish.owner = deleteConfidentialDataFromUser(wish.owner);
  }
  if (wish.offers && wish.offers.length) {
    wish.offers = deleteConfidentialDataFromOffers(wish.offers);
  }
  return wish;
}
