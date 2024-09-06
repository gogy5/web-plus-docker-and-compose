import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Offer } from '../offers/entities/offer.entity';
import { deleteConfidentialDataFromUser } from './user-confidential-data-interceptor.service';

@Injectable()
export class OfferConfidentialDataInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<Offer | Offer[]>,
  ): Observable<Offer | Offer[]> {
    return next.handle().pipe(map(deleteConfidentialDataFromOfferData));
  }
}

function deleteConfidentialDataFromOfferData(
  data: Offer | Offer[],
): Offer | Offer[] {
  if (Array.isArray(data)) {
    return deleteConfidentialDataFromOffers(data);
  } else {
    return deleteConfidentialDataFromOffer(data);
  }
}

export function deleteConfidentialDataFromOffers(offers: Offer[]): Offer[] {
  return offers.map(deleteConfidentialDataFromOffer);
}

function deleteConfidentialDataFromOffer(offer: Offer): Offer {
  if (offer.user) {
    offer.user = deleteConfidentialDataFromUser(offer.user);
  }
  return offer;
}
