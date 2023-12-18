import { Exclude, Expose } from 'class-transformer';
import { ColumnNumericTransformer } from 'src/shared/transformers/column-numeric.transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'money_account' })
export class MoneyAccount {
  constructor(partial?: Partial<MoneyAccount>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  balance: number;

  @Column({
    name: 'balance_in_use',
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  balanceInUse: number;

  @Column()
  name: string;

  @Column({ default: false })
  @Exclude()
  blocked: boolean;

  @Expose()
  get availableBalance(): number {
    return this.balance - this.balanceInUse;
  }
}
