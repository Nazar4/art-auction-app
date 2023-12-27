import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'isIntegerOrDecimalConstraint', async: false })
export class IsIntegerOrDecimalConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    if (Number.isInteger(value)) {
      return true;
    }

    const decimalRegex = /^\d+\.\d{2}$/;
    return typeof value === 'number' && decimalRegex.test(value.toFixed(2));
  }

  defaultMessage(args: ValidationArguments): string {
    return 'The number must be a positive integer or a decimal with two digits after the decimal point.';
  }
}
