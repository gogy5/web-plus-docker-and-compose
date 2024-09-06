import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserConfidentialDataInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<User | User[]>,
  ): Observable<User | User[]> {
    const request = context.switchToHttp().getRequest();
    if (request.method === 'GET' && request.url === '/users/me') {
      return next.handle().pipe(map(deletePasswordFromUser));
    }

    return next.handle().pipe(map(deleteConfidentialDataFromUsersData));
  }
}

function deleteConfidentialDataFromUsersData(
  data: User | User[],
): User | User[] {
  if (Array.isArray(data)) {
    return deleteConfidentialDataFromUsers(data);
  } else {
    return deleteConfidentialDataFromUser(data);
  }
}

function deleteConfidentialDataFromUsers(users: User[]): User[] {
  return users.map(deleteConfidentialDataFromUser);
}

export function deleteConfidentialDataFromUser(user: User): User {
  delete user.password;
  delete user.email;
  return user;
}

function deletePasswordFromUser(user: User): User {
  delete user.password;
  return user;
}
