import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auction' })
export class Auction {
  constructor(partial?: Partial<Auction>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_date', type: 'datetime' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'datetime' })
  endDate: Date;

  @Column({ name: 'auction_finished', default: false })
  auctionFinished: boolean;

  @Expose()
  get finishesIn(): string {
    const currentDate = new Date();
    const endDate = new Date(this.endDate);
    const differenceInTime = endDate.getTime() - currentDate.getTime();

    if (differenceInTime <= 0) {
      return 'Auction has finished';
    }

    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays < 1) {
      return '< 1 day';
    } else if (differenceInDays > 30) {
      const months = Math.floor(differenceInDays / 30);
      const days = Math.floor(differenceInDays % 30);
      return `${months} month(s) and ${days} day(s)`;
    } else {
      return `${Math.floor(differenceInDays)} day(s)`;
    }
  }
}
