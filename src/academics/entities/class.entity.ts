import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g., "Grade 10 - Section A"

  @Column()
  academicYear: string; // e.g., "2024-2025"

  @CreateDateColumn()
  createdAt: Date;
}
