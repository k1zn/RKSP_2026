import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('species')
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  latin_name: string;

  @Column({ nullable: false })
  common_name: string;

  @Column({ nullable: true })
  family: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'float' })
  max_height_m: number;
}
