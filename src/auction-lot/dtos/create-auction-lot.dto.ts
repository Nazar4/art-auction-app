import { IsIntegerOrDecimalConstraint } from 'src/shared/validation-constraints/is-integer-or-decimal.constraint';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, Min } from 'class-validator';

export class CreateAuctionLotDTO {
  @Type(() => IsIntegerOrDecimalConstraint)
  @Min(0.0)
  initialPrice!: number;

  @IsNotEmpty()
  @Min(0)
  productId!: number;

  @IsNotEmpty()
  @IsDate()
  startDate!: Date;

  @IsNotEmpty()
  @IsDate()
  endDate!: Date;
}
