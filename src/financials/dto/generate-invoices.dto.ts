import { IsUUID, IsDateString } from 'class-validator';

export class GenerateInvoicesDto {
  @IsUUID()
  classId: string;

  @IsUUID()
  feeStructureId: string;

  @IsDateString()
  dueDate: string;
}
