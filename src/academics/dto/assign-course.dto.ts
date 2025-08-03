import { IsUUID } from 'class-validator';

export class AssignCourseDto {
  @IsUUID()
  classId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  teacherId: string;
}
