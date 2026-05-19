import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'admin' | 'user' | 'guest';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: true, type: 'int' })
  age!: number | null;

  @Column({ default: 'user' })
  role!: UserRole;

  @Column({ nullable: false })
  password_hash!: string;
}
