import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// enum RoleEnum {
//   USER = 1, //if not specified start with 0
//   MANUFACTURER,
//   ADMIN,
// }

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
