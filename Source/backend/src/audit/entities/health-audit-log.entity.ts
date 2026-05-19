import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tree } from '../../trees/entities/tree.entity';

@Entity('health_audit_log')
export class HealthAuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Tree, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'tree_id' })
  tree!: Tree;

  @Column({ nullable: false })
  tree_id!: number;

  @Column({ nullable: true })
  old_status!: string;

  @Column({ nullable: true })
  new_status!: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  changed_at!: Date;
}
