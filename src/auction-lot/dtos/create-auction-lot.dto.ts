import { IsIntegerOrDecimalConstraint } from 'src/shared/validation-constraints/is-integer-or-decimal.constraint';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsPositive, Min } from 'class-validator';
import { IsEndDateAfterStartDate } from '../decorators/validation/is-end-date-after-start-date.constraint';

export class CreateAuctionLotDTO {
  @Type(() => IsIntegerOrDecimalConstraint)
  initialPrice!: number;

  @IsNotEmpty()
  @IsPositive()
  productId!: number;

  @IsNotEmpty()
  startDate!: Date;

  @IsNotEmpty()
  @IsEndDateAfterStartDate('startDate')
  endDate!: Date;
}
