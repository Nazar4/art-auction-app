import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  constructor(partial?: Partial<Product>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int', precision: 10, nullable: true })
  height: number;

  @Column({ type: 'int', precision: 10, nullable: true })
  width: number;

  @Column()
  material: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'percentage_fee', type: 'decimal', precision: 10, scale: 2 })
  percentageFee: number;

  @Column({ type: 'blob', name: 'photo_file_path', nullable: true })
  photoFilePath: Buffer;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Manufacturer, { lazy: true, nullable: false })
  @JoinColumn({ name: 'manufacturer', referencedColumnName: 'id' })
  creator: Manufacturer;
}
