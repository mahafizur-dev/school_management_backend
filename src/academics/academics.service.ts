import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Subject } from './entities/subject.entity';
import { Course } from './entities/course.entity'; // <-- Import Course
import { User } from '../users/entities/user.entity'; // <-- Import User
import { Role } from '../users/enums/role.enum'; // <-- Import Role
import { Enrollment } from './entities/enrollment.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { AssignCourseDto } from './dto/assign-course.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { Grade } from './entities/grade.entity';
import { SubmitGradeDto } from './dto/submit-grade.dto';

@Injectable()
export class AcademicsService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Course) // <-- Inject Course repository
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User) // <-- Inject User repository to validate teacher
    @InjectRepository(Enrollment) // <-- Inject Enrollment repository
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Grade) // <-- Inject Grade repository
    private readonly gradeRepository: Repository<Grade>,
  ) {}

  // Class Methods
  async createClass(createClassDto: CreateClassDto): Promise<Class> {
    const existingClass = await this.classRepository.findOne({
      where: { name: createClassDto.name },
    });
    if (existingClass) {
      throw new ConflictException('A class with this name already exists.');
    }
    const newClass = this.classRepository.create(createClassDto);
    return this.classRepository.save(newClass);
  }

  async findAllClasses(): Promise<Class[]> {
    return this.classRepository.find();
  }

  // Subject Methods
  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const existingSubject = await this.subjectRepository.findOne({
      where: { name: createSubjectDto.name },
    });
    if (existingSubject) {
      throw new ConflictException('A subject with this name already exists.');
    }
    const newSubject = this.subjectRepository.create(createSubjectDto);
    return this.subjectRepository.save(newSubject);
  }

  async assignCourse(assignCourseDto: AssignCourseDto): Promise<Course> {
    const { classId, subjectId, teacherId } = assignCourseDto;

    // 1. Validate that the entities exist
    const classToAssign = await this.classRepository.findOneBy({ id: classId });
    if (!classToAssign)
      throw new NotFoundException(`Class with ID ${classId} not found.`);

    const subjectToAssign = await this.subjectRepository.findOneBy({
      id: subjectId,
    });
    if (!subjectToAssign)
      throw new NotFoundException(`Subject with ID ${subjectId} not found.`);

    const teacherToAssign = await this.userRepository.findOne({
      where: { id: teacherId, role: Role.Teacher },
    });
    if (!teacherToAssign)
      throw new NotFoundException(
        `Teacher with ID ${teacherId} not found or user is not a teacher.`,
      );

    // 2. Check if this assignment already exists
    const existingCourse = await this.courseRepository.findOne({
      where: {
        class: { id: classId },
        subject: { id: subjectId },
      },
    });

    if (existingCourse) {
      throw new ConflictException(
        'This subject is already assigned to this class.',
      );
    }

    // 3. Create and save the new course assignment
    const newCourse = this.courseRepository.create({
      class: classToAssign,
      subject: subjectToAssign,
      teacher: teacherToAssign,
    });

    return this.courseRepository.save(newCourse);
  }

  async enrollStudent(enrollStudentDto: EnrollStudentDto): Promise<Enrollment> {
    const { studentId, classId } = enrollStudentDto;

    // 1. Validate that the entities exist
    const studentToEnroll = await this.userRepository.findOne({
      where: { id: studentId, role: Role.Student },
    });
    if (!studentToEnroll)
      throw new NotFoundException(
        `Student with ID ${studentId} not found or user is not a student.`,
      );

    const classToEnrollIn = await this.classRepository.findOneBy({
      id: classId,
    });
    if (!classToEnrollIn)
      throw new NotFoundException(`Class with ID ${classId} not found.`);

    // 2. Check if this enrollment already exists
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        student: { id: studentId },
        class: { id: classId },
      },
    });
    if (existingEnrollment) {
      throw new ConflictException(
        'This student is already enrolled in this class.',
      );
    }

    // 3. Create and save the new enrollment
    const newEnrollment = this.enrollmentRepository.create({
      student: studentToEnroll,
      class: classToEnrollIn,
    });

    return this.enrollmentRepository.save(newEnrollment);
  }

  async findStudentsByClass(classId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { class: { id: classId } },
      relations: ['student', 'class'], // Ensure relations are loaded
    });
  }

  async findCoursesByTeacher(teacherId: string): Promise<Course[]> {
    return this.courseRepository.find({
      where: { teacher: { id: teacherId } },
      // eager loading on the entity handles the rest
    });
  }
  async findAllCourses(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findAllSubjects(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  async submitGrade(
    submitGradeDto: SubmitGradeDto,
    teacher: User,
  ): Promise<Grade> {
    const { studentId, courseId, grade, term } = submitGradeDto;

    // 1. Validate entities
    const student = await this.userRepository.findOne({
      where: { id: studentId, role: Role.Student },
    });
    if (!student) throw new NotFoundException('Student not found.');

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found.');

    // 2. Security Check: Ensure the teacher submitting the grade is assigned to that course
    if (course.teacher.id !== teacher.id) {
      throw new UnauthorizedException(
        'You are not authorized to submit grades for this course.',
      );
    }

    // 3. Find existing grade or create a new one (Upsert logic)
    let gradeRecord = await this.gradeRepository.findOne({
      where: {
        student: { id: studentId },
        course: { id: courseId },
        term: term,
      },
    });

    if (gradeRecord) {
      // Update existing grade
      gradeRecord.grade = grade;
    } else {
      // Create new grade
      gradeRecord = this.gradeRepository.create({
        student,
        course,
        teacher,
        term,
        grade,
      });
    }

    return this.gradeRepository.save(gradeRecord);
  }

  async findGradesByCourse(courseId: string): Promise<Grade[]> {
    return this.gradeRepository.find({
      where: { course: { id: courseId } },
      relations: ['student'], // We only need the student info here
    });
  }
  async findCoursesForStudent(studentId: string): Promise<Course[]> {
    // 1. Find the class the student is enrolled in.
    const enrollment = await this.enrollmentRepository.findOne({
      where: { student: { id: studentId } },
      relations: ['class'],
    });

    if (!enrollment) {
      // If student is not enrolled in any class, return an empty array.
      return [];
    }

    // 2. Find all courses (subjects) offered for that class.
    return this.courseRepository.find({
      where: { class: { id: enrollment.class.id } },
    });
  }

  async findGradesForStudent(studentId: string): Promise<Grade[]> {
    // Find all grades recorded for the given student ID.
    // We need to join the course and subject to display them in the UI.
    return this.gradeRepository.find({
      where: { student: { id: studentId } },
      relations: ['course', 'course.subject', 'course.teacher'],
    });
  }
}
