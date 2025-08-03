import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { User } from '../users/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply guards to the whole controller
@Roles(Role.Admin) // Only Admins can access routes in this controller
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('students')
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<User> {
    const student = await this.adminService.createStudent(createStudentDto);
    // Exclude password from the response
    const { password, ...result } = student;
    return result as User;
  }

  @Get('students')
  async findAllStudents(): Promise<User[]> {
    return this.adminService.findAllStudents();
  }

  @Post('teachers')
  async createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<User> {
    const teacher = await this.adminService.createTeacher(createTeacherDto);
    const { password, ...result } = teacher;
    return result as User;
  }

  @Get('teachers')
  async findAllTeachers(): Promise<User[]> {
    return this.adminService.findAllTeachers();
  }
}
