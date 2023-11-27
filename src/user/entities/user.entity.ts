import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Address } from '../../address/entities/address.entity';
import { MoneyAccount } from 'src/money-account/entities/money-account.entity';

@Entity({ name: 'user' })
@Unique(['address', 'moneyAccount'])
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ default: true })
  enabled: boolean;

  @ManyToOne(() => Role, { eager: true, nullable: false })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @OneToOne(() => Address, { lazy: true, nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address: Address;

  @OneToOne(() => MoneyAccount, {
    eager: true, //needs to be lazy true
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'money_account_id', referencedColumnName: 'id' })
  moneyAccount: MoneyAccount;
}
