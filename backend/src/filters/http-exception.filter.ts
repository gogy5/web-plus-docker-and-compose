import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { httpErrorDescriptionMap } from './utils/http-exception-description-mapping';
import { BusinessException } from './utils/business-exception';
import { ExceptionResponse } from './utils/exception-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (exception instanceof BusinessException) {
      response.status(status).json({
        message: exception.message,
        statusCode: status,
      });
      return;
    }

    const message =
      httpErrorDescriptionMap.get(status) ||
      'Возникла непредвиденная ошибка. Обратитесь в техподдержку.';

    const exceptionResponse = new ExceptionResponse(message, status);

    if (exception instanceof BadRequestException) {
      exceptionResponse.description = exception.getResponse();
    }

    response.status(status).json(exceptionResponse.toJson());
  }
}
