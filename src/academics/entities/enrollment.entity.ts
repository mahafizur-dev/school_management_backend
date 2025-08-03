import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Class } from './class.entity';
import { User } from '../../users/entities/user.entity';

@Entity('enrollments')
@Unique(['student', 'class']) // Prevents enrolling the same student in the same class twice
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ManyToOne(() => Class, { eager: true })
  @JoinColumn({ name: 'classId' })
  class: Class;
}
