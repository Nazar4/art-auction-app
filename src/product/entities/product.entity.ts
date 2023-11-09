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

  @Column({ name: 'percentage-fee', type: 'decimal', precision: 10, scale: 2 })
  percentageFee: number;

  @Column({ name: 'photo_file_path' })
  photoFilePath: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Manufacturer, { lazy: true, nullable: false })
  @JoinColumn({ name: 'manufacturer', referencedColumnName: 'id' })
  creator: Manufacturer;
}
