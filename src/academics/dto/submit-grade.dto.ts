import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class SubmitGradeDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsString()
  @IsNotEmpty()
  term: string;
}
