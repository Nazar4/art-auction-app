import { Exclude, Expose } from 'class-transformer';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { ColumnNumericTransformer } from 'src/shared/transformers/column-numeric.transformer';
import { Constants } from 'src/shared/type-utils/global.constants';
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

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    precision: 10,
    scale: 2,
  })
  price: number;

  @Exclude()
  @Column({ name: 'percentage_fee', type: 'decimal', precision: 10, scale: 2 })
  percentageFee: number;

  @Exclude()
  @Column({ type: 'blob', name: 'photo_file_path', nullable: true })
  photoFilePath: Buffer;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Manufacturer, { eager: false, nullable: false })
  @JoinColumn({ name: 'manufacturer', referencedColumnName: 'id' })
  creator: Manufacturer;

  @Expose()
  get size(): string {
    return this.height + 'x' + this.width;
  }

  public calculatePercentageFeeForProductPrice(): void {
    const percentageFee = this.price * 0.01;

    const isBelowLowerBound = percentageFee < Constants.LOWER_BOUND;
    const isAboveUpperBound = percentageFee > Constants.UPPER_BOUND;

    this.percentageFee = isBelowLowerBound
      ? percentageFee
      : isAboveUpperBound
      ? 10000
      : Constants.LOWER_BOUND ?? percentageFee;
  }
}
