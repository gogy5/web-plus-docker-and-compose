import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  AuthForbiddenByIncorrectCredentials,
  UserAlreadyExists,
  UserCreatingError,
  UserNotFound,
  UserUpdatingError,
  WishNotFound,
  WishesNotFound,
  WishUpdatingError,
  WishUpdatingForbiddenByExistingOffers,
  WishUpdatingForbiddenByOwner,
  WishCopyingError,
  WishDeletingForbiddenByOwner,
  OfferForbiddenByOwner,
  OfferNotFound,
  OfferCreatingError,
  OfferCreatingForbiddenByAmountExcess,
  WishlistNotFound,
  WishlistCreatingError,
  WishlistUpdatingForbiddenByOwner,
  WishlistUpdatingError,
  WishlistDeletingForbiddenByOwner,
}

interface ErrorDescription {
  message: string;
  statusCode: number;
}

export const businessExceptionDescriptionMap = new Map<
  ErrorCode,
  ErrorDescription
>([
  [
    ErrorCode.AuthForbiddenByIncorrectCredentials,
    {
      message: 'Некорректная пара логин и пароль',
      statusCode: HttpStatus.UNAUTHORIZED,
    },
  ],
  [
    ErrorCode.UserAlreadyExists,
    {
      message: 'Пользователь с таким email или username уже зарегистрирован',
      statusCode: HttpStatus.CONFLICT,
    },
  ],
  [
    ErrorCode.UserCreatingError,
    {
      message: 'Ошибка сохранения данных',
      statusCode: HttpStatus.BAD_REQUEST,
    },
  ],
  [
    ErrorCode.UserNotFound,
    {
      message: 'Пользователь не найден',
      statusCode: HttpStatus.NOT_FOUND,
    },
  ],
  [
    ErrorCode.UserUpdatingError,
    {
      message: 'Ошибка обновления пользователя, некорректные данные',
      statusCode: HttpStatus.NOT_FOUND,
    },
  ],
  [
    ErrorCode.WishNotFound,
    {
      message: 'Подарок не найден',
      statusCode: HttpStatus.NOT_FOUND,
    },
  ],
  [
    ErrorCode.WishesNotFound,
    {
      message: 'Подарки не найдены',
      statusCode: HttpStatus.NOT_FOUND,
    },
  ],
  [
    ErrorCode.WishUpdatingForbiddenByExistingOffers,
    {
      message:
        'Этот подарок больше нельзя редактировать, т.к. на него уже кто-то скидывается',
      statusCode: HttpStatus.FORBIDDEN,
    },
  ],
  [
    ErrorCode.WishUpdatingForbiddenByOwner,
    {
      message: 'Можно редактировать только свои подарки',
      statusCode: HttpStatus.FORBIDDEN,
    },
  ],
  [
    ErrorCode.WishCopyingError,
    {
      message: 'Ошибка при копировании желания',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  ],
  [
    ErrorCode.WishDeletingForbiddenByOwner,
    {
      message: 'Удаление чужих желание запрещено',
      statusCode: HttpStatus.FORBIDDEN,
    },
  ],
  [
    ErrorCode.OfferForbiddenByOwner,
    {
      message: 'Нельзя вносить деньги на свои подарки',
      statusCode: HttpStatus.FORBIDDEN,
    },
  ],
  [
    ErrorCode.OfferNotFound,
    {
      message: 'Поддержка не найдена',
      statusCode: HttpStatus.NOT_FOUND,
    },
  ],
  [
    ErrorCode.OfferCreatingForbiddenByAmountExcess,
    {
      message: 'Слишком большая сумма поддержки',
      statusCode: HttpStatus.FORBIDDEN,
    },
  ],
  [
    ErrorCode.OfferCreatingError,
    {
      message: 'Ошибка при внесении поддержки',
      statusCode: HttpStatus.FORBIDDEN,
    },
  ],
  [
    ErrorCode.WishUpdatingError,
    {
      message: 'Ошибка обновления информации о желании, некорректные данные',
      statusCode: HttpStatus.BAD_REQUEST,
    },
  ],
  [
    ErrorCode.WishlistNotFound,
    {
      message: 'Список подарков не найден',
      statusCode: HttpStatus.NOT_FOUND,
    },
  ],
  [
    ErrorCode.WishlistCreatingError,
    {
      message: 'Ошибка при создании списка подарков',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  ],
  [
    ErrorCode.WishlistUpdatingForbiddenByOwner,
    {
      message: 'Нельзя изменять чужие подборки подарков',
      statusCode: HttpStatus.FORBIDDEN,
    },
  ],
  [
    ErrorCode.WishlistUpdatingError,
    {
      message: 'Ошибка при обновлении подборки подарков',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  ],
  [
    ErrorCode.WishlistDeletingForbiddenByOwner,
    {
      message: 'Нельзя удалять чужие подборки подарков',
      statusCode: HttpStatus.FORBIDDEN,
    },
  ],
]);
