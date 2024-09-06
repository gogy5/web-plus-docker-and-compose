import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ForbiddenToChange(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'forbiddenToChange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === undefined || value === null;
        },
        defaultMessage(args: ValidationArguments) {
          return `A field '${args.property}' forbidden to change.`;
        },
      },
    });
  };
}
