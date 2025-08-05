import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { FeeStructure } from './fee-structure.entity';

export enum InvoiceStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  OVERDUE = 'OVERDUE',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ManyToOne(() => FeeStructure)
  @JoinColumn({ name: 'feeStructureId' })
  feeStructure: FeeStructure;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
  status: InvoiceStatus;

  @Column()
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
