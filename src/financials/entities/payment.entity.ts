import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountPaid: number;

  @CreateDateColumn()
  paymentDate: Date;
}
