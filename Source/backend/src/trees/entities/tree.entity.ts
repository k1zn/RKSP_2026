import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Species } from '../../species/entities/species.entity';
import { Location } from '../../locations/entities/location.entity';

export type HealthStatus = 'healthy' | 'ill' | 'dead';

@Entity('trees')
export class Tree {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Species, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'species_id' })
  species!: Species;

  @Column({ nullable: false })
  species_id!: number;

  @ManyToOne(() => Location, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' })
  location!: Location;

  @Column({ nullable: true })
  location_id!: number;

  @Column({ type: 'date', nullable: true })
  plant_date!: string;

  @Column({ default: 'healthy' })
  health_status!: HealthStatus;

  @Column({ nullable: true, type: 'text' })
  notes!: string;
}
