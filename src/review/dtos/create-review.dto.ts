import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDTO {
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
