import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeStructure } from './entities/fee-structure.entity';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { GenerateInvoicesDto } from './dto/generate-invoices.dto';
import { Enrollment } from '../academics/entities/enrollment.entity';

@Injectable()
export class FinancialsService {
  constructor(
    @InjectRepository(FeeStructure)
    private readonly feeStructureRepository: Repository<FeeStructure>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  // Fee Structure Methods
  async createFeeStructure(dto: CreateFeeStructureDto): Promise<FeeStructure> {
    const newFeeStructure = this.feeStructureRepository.create(dto);
    return this.feeStructureRepository.save(newFeeStructure);
  }

  async findAllFeeStructures(): Promise<FeeStructure[]> {
    return this.feeStructureRepository.find();
  }

  // Invoice Methods
  async generateInvoicesForClass(dto: GenerateInvoicesDto): Promise<Invoice[]> {
    const { classId, feeStructureId, dueDate } = dto;

    const feeStructure = await this.feeStructureRepository.findOneBy({
      id: feeStructureId,
    });
    if (!feeStructure) throw new NotFoundException('Fee structure not found.');

    const enrollments = await this.enrollmentRepository.find({
      where: { class: { id: classId } },
      relations: ['student'],
    });
    if (enrollments.length === 0)
      throw new NotFoundException('No students enrolled in this class.');

    const invoicesToCreate = enrollments.map((enrollment) => {
      return this.invoiceRepository.create({
        student: enrollment.student,
        feeStructure: feeStructure,
        amount: feeStructure.amount,
        dueDate: new Date(dueDate),
        status: InvoiceStatus.UNPAID,
      });
    });

    return this.invoiceRepository.save(invoicesToCreate);
  }

  async findInvoicesByStudent(studentId: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { student: { id: studentId } },
      relations: ['feeStructure'],
    });
  }
}
