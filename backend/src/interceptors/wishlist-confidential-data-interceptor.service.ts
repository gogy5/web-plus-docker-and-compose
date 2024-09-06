import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { deleteConfidentialDataFromUser } from './user-confidential-data-interceptor.service';

@Injectable()
export class WishlistConfidentialDataInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<Wishlist | Wishlist[]>,
  ): Observable<Wishlist | Wishlist[]> {
    return next.handle().pipe(map(deleteConfidentialDataFromWishlistData));
  }
}

function deleteConfidentialDataFromWishlistData(
  data: Wishlist | Wishlist[],
): Wishlist | Wishlist[] {
  if (Array.isArray(data)) {
    return deleteConfidentialDataFromWishlists(data);
  } else {
    return deleteConfidentialDataFromWishlist(data);
  }
}

export function deleteConfidentialDataFromWishlists(
  wishlists: Wishlist[],
): Wishlist[] {
  return wishlists.map(deleteConfidentialDataFromWishlist);
}

function deleteConfidentialDataFromWishlist(wishlist: Wishlist): Wishlist {
  if (wishlist.owner) {
    wishlist.owner = deleteConfidentialDataFromUser(wishlist.owner);
  }
  return wishlist;
}
