import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsNumber()
  @IsInt()
  @Min(10)
  public height!: number;

  @IsNumber()
  @IsInt()
  @Min(10)
  public width!: number;

  @IsString()
  @IsNotEmpty()
  public material!: string;

  // @IsDecimal({ decimal_digits: '2,10' }) // precision: 2, scale: 1
  @IsNumber()
  @Min(0.0)
  public price!: number;

  @IsString()
  @IsOptional()
  public description?: string;
}
