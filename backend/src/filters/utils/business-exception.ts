import { HttpException } from '@nestjs/common';
import {
  ErrorCode,
  businessExceptionDescriptionMap,
} from './business-exception-description-mapping';

export class BusinessException extends HttpException {
  constructor(code: ErrorCode) {
    const { message, statusCode } = businessExceptionDescriptionMap.get(code);
    super(message, statusCode);
  }
}
