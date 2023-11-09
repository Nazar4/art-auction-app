import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auction' })
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_date', type: 'datetime' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'datetime' })
  endDate: Date;
}
