import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Class } from './class.entity';
import { Subject } from './subject.entity';
import { User } from '../../users/entities/user.entity';

@Entity('courses')
// This constraint ensures that you cannot assign the same subject to the same class more than once.
@Unique(['class', 'subject'])
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Class, { eager: true }) // eager: true automatically loads the class
  @JoinColumn({ name: 'classId' })
  class: Class;

  @ManyToOne(() => Subject, { eager: true }) // eager: true automatically loads the subject
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @ManyToOne(() => User, { eager: true }) // eager: true automatically loads the teacher
  @JoinColumn({ name: 'teacherId' })
  teacher: User;
}
