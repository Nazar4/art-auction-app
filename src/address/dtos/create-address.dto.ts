import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAddressDTO {
  @IsString()
  @IsNotEmpty()
  public streetName!: string;

  @IsString()
  @IsOptional()
  public city?: string;

  @IsString()
  @IsNotEmpty()
  public country!: string;

  @IsNumberString()
  @Length(5, 5)
  public postalCode!: string;
}
