import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'street_name' })
  streetName: string;

  @Column({ name: 'postal_code' })
  postalCode: number;

  @Column({ nullable: true, length: 50 })
  city: string;

  @Column({ length: 50 })
  country: string;
}
