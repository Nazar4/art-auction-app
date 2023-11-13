import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateAddressDTO {
  @IsString()
  @IsNotEmpty()
  public streetName!: string;

  @IsString()
  @IsOptional()
  public city?: string;

  @IsString()
  @IsOptional()
  public country?: string;

  @IsNumberString()
  @Length(5, 5)
  @IsOptional()
  public postalCode?: string;
}
