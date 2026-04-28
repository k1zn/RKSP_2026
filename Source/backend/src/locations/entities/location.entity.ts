import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, type: 'float' })
  area_ha: number;

  @Column({ nullable: true, type: 'text' })
  description: string;
}
