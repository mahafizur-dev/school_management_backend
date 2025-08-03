import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/role.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<User> {
    const { email, password, firstName, lastName } = createStudentDto;

    // Check if user already exists
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const newUser = this.usersRepository.create({
      email,
      password, // The entity's @BeforeInsert will hash this
      firstName,
      lastName,
      role: Role.Student, // Hardcode the role to Student
    });

    return this.usersRepository.save(newUser);
  }

  async findAllStudents(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: Role.Student },
      select: ['id', 'email', 'firstName', 'lastName', 'createdAt'], // Explicitly select fields to return
    });
  }

  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<User> {
    const { email, password, firstName, lastName } = createTeacherDto;

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const newUser = this.usersRepository.create({
      email,
      password,
      firstName,
      lastName,
      role: Role.Teacher, // Hardcode the role to Teacher
    });

    return this.usersRepository.save(newUser);
  }

  async findAllTeachers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: Role.Teacher },
      select: ['id', 'email', 'firstName', 'lastName', 'createdAt'],
    });
  }
}
