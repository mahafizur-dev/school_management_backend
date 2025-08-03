import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from '../../users/entities/user.entity';

@Entity('grades')
// A student can only have one grade per course per term (e.g., one grade for Math in Mid-Term)
@Unique(['student', 'course', 'term'])
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  grade: string; // e.g., "A+", "B-", "85%"

  @Column()
  term: string; // e.g., "Mid-Term", "Final", "Quiz 1"

  @ManyToOne(() => User) // The student receiving the grade
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ManyToOne(() => Course, { eager: true }) // The course the grade is for
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(() => User) // The teacher who gave the grade
  @JoinColumn({ name: 'teacherId' })
  teacher: User;
}
