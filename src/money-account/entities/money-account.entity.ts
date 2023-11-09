import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'money_account' })
export class MoneyAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  balanceInUse: number;

  @Column()
  name: string;

  @Column({ default: false })
  blocked: boolean;
}
