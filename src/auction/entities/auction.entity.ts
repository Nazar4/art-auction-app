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
}
