import { IsUUID } from 'class-validator';

export class EnrollStudentDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  classId: string;
}
