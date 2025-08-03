import { Module } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { AcademicsController } from './academics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Subject } from './entities/subject.entity';
import { Course } from './entities/course.entity';
import { Enrollment } from './entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Grade } from './entities/grade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, Subject, Course, User, Enrollment, Grade]),
  ],
  controllers: [AcademicsController],
  providers: [AcademicsService],
})
export class AcademicsModule {}
