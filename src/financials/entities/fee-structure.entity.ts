import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('fee_structures')
@Unique(['name'])
export class FeeStructure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "Annual Tuition - Grade 10"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  description: string;
}
