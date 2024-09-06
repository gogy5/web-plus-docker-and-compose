export class ExceptionResponse {
  set description(value: string | object) {
    this._description = value;
  }

  private _description: string | object;
  private readonly _message: string;
  private readonly _statusCode: number;

  constructor(message: string, statusCode: number) {
    this._message = message;
    this._statusCode = statusCode;
  }

  toJson() {
    const jsonResponse = {
      message: this._message,
      description: this._description,
      statusCode: this._statusCode,
    };
    if (!jsonResponse.description) {
      delete jsonResponse.description;
    }
    return jsonResponse;
  }
}
