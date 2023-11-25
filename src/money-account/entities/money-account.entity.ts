import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'money_account' })
export class MoneyAccount {
  constructor(partial?: Partial<MoneyAccount>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  balance: number;

  @Column({
    name: 'balance_in_use',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  balanceInUse: number;

  @Column()
  name: string;

  @Column({ default: false })
  blocked: boolean;
}
