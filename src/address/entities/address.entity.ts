import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'address' })
export class Address {
  constructor(partial?: Partial<Address>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'street_name' })
  streetName: string;

  @Column({ name: 'postal_code', length: 5 })
  postalCode: string;

  @Column({ nullable: true, length: 50 })
  city: string;

  @Column({ length: 50 })
  country: string;

  @Expose()
  get formattedAddress(): string {
    return `${this.country}, ${this.postalCode}, ${this.city}, ${this.streetName}`;
  }
}
