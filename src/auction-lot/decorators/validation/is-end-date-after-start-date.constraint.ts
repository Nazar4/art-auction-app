import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { DateUtils } from 'src/shared/type-utils/date-utils';

export function IsEndDateAfterStartDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEndDateAfterStartDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, { object }: ValidationArguments) {
          if (!object.hasOwnProperty(property)) {
            return false;
          }

          const startDate = new Date(object[property]);
          const endDate = new Date(value);

          if (!startDate || !endDate) {
            return false;
          }

          return DateUtils.isEndDateAfterStartDate(startDate, endDate);
        },
        defaultMessage(args: ValidationArguments) {
          return 'The endDate must be at least 1 month greater than the startDate.';
        },
      },
    });
  };
}
