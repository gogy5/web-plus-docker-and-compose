import { HttpStatus } from '@nestjs/common';

export const httpErrorDescriptionMap = new Map<number, string>([
  [HttpStatus.NOT_FOUND, 'Страница не найдена'],
  [HttpStatus.INTERNAL_SERVER_ERROR, 'Непредвиденная ошибка'],
  [HttpStatus.BAD_REQUEST, 'Ошибка валидации данных'],
  [HttpStatus.UNAUTHORIZED, 'Ошибка авторизации'],
]);
