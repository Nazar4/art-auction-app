import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { IsRepeated } from '../decorators/validation/is-repeated.constraint';
import { UserDoesNotExist } from '../decorators/validation/user-does-not-exist.constraint';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @UserDoesNotExist()
  @Length(4)
  public username!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2)
  public firstName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2)
  public lastName!: string;

  @IsEmail()
  @UserDoesNotExist()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  public password!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @IsRepeated('password')
  public repeatPassword!: string;

  //   @IsNumberString()
  @Length(10, 10)
  @IsMobilePhone()
  public phoneNumber!: string;
}
