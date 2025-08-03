import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/user.decorator'; // Make sure this is imported
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { AssignCourseDto } from './dto/assign-course.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { SubmitGradeDto } from './dto/submit-grade.dto';
import { Grade } from './entities/grade.entity';

@Controller('academics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Post('classes')
  createClass(@Body() createClassDto: CreateClassDto) {
    return this.academicsService.createClass(createClassDto);
  }

  @Get('classes')
  findAllClasses() {
    return this.academicsService.findAllClasses();
  }

  @Post('subjects')
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.academicsService.createSubject(createSubjectDto);
  }

  @Get('subjects')
  findAllSubjects() {
    return this.academicsService.findAllSubjects();
  }

  @Post('courses')
  assignCourse(@Body() assignCourseDto: AssignCourseDto) {
    return this.academicsService.assignCourse(assignCourseDto);
  }

  @Get('courses')
  findAllCourses() {
    return this.academicsService.findAllCourses();
  }

  @Roles(Role.Admin)
  @Post('enrollments')
  enrollStudent(@Body() enrollStudentDto: EnrollStudentDto) {
    return this.academicsService.enrollStudent(enrollStudentDto);
  }

  @Roles(Role.Admin, Role.Teacher) // Admins and Teachers can see class rosters
  @Get('classes/:classId/students')
  findStudentsByClass(@Param('classId') classId: string) {
    return this.academicsService.findStudentsByClass(classId);
  }
  @Get('my-courses')
  @Roles(Role.Teacher) // Only teachers can access this
  findMyCourses(@GetUser() user: User) {
    return this.academicsService.findCoursesByTeacher(user.id);
  }

  @Roles(Role.Teacher)
  @Post('grades')
  submitGrade(
    @Body() submitGradeDto: SubmitGradeDto,
    @GetUser() teacher: User,
  ) {
    return this.academicsService.submitGrade(submitGradeDto, teacher);
  }

  @Roles(Role.Teacher, Role.Admin)
  @Get('grades/course/:courseId')
  findGradesByCourse(@Param('courseId') courseId: string) {
    return this.academicsService.findGradesByCourse(courseId);
  }
  @Get('student/my-courses')
  @Roles(Role.Student)
  findStudentCourses(@GetUser() student: User) {
    return this.academicsService.findCoursesForStudent(student.id);
  }

  @Get('student/my-grades')
  @Roles(Role.Student)
  findStudentGrades(@GetUser() student: User) {
    return this.academicsService.findGradesForStudent(student.id);
  }
}
