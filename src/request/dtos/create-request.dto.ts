import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { IsIntegerOrDecimalConstraint } from 'src/shared/validation-constraints/is-integer-or-decimal.constraint';

export class CreateRequestDTO {
  @Type(() => IsIntegerOrDecimalConstraint)
  public sum!: number;

  @IsNotEmpty()
  @IsPositive()
  public auctionLotId!: number;
}
