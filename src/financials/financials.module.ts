import { Module } from '@nestjs/common';
import { FinancialsService } from './financials.service';
import { FinancialsController } from './financials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeStructure } from './entities/fee-structure.entity';
import { Invoice } from './entities/invoice.entity';
import { Payment } from './entities/payment.entity';
import { Enrollment } from '../academics/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeeStructure, Invoice, Payment, Enrollment]),
  ],
  controllers: [FinancialsController],
  providers: [FinancialsService],
})
export class FinancialsModule {}
