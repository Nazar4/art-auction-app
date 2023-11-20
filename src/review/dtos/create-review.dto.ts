import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDTO {
  @IsDecimal({ decimal_digits: '1,2' }) // precision: 2, scale: 1
  @Min(0.0)
  @Max(5.0)
  public rating!: number;

  @IsString()
  @IsOptional()
  public reviewText?: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  public manufacturerId!: number;
}
