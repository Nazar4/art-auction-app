import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateRequestDTO {
  @IsNumber()
  @Min(0.0)
  public sum!: number;

  @IsInt()
  @IsNotEmpty()
  public auctionLotId!: number;
}
