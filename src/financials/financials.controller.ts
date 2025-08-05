import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FinancialsService } from './financials.service';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { GenerateInvoicesDto } from './dto/generate-invoices.dto';

@Controller('financials')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancialsController {
  constructor(private readonly financialsService: FinancialsService) {}

  @Post('fee-structures')
  @Roles(Role.Admin)
  createFeeStructure(@Body() dto: CreateFeeStructureDto) {
    return this.financialsService.createFeeStructure(dto);
  }

  @Get('fee-structures')
  @Roles(Role.Admin)
  findAllFeeStructures() {
    return this.financialsService.findAllFeeStructures();
  }

  @Post('invoices/generate')
  @Roles(Role.Admin)
  generateInvoices(@Body() dto: GenerateInvoicesDto) {
    return this.financialsService.generateInvoicesForClass(dto);
  }

  // This endpoint can be used by students later
  @Get('invoices/student/:studentId')
  @Roles(Role.Admin, Role.Student)
  findInvoicesByStudent(@Param('studentId') studentId: string) {
    return this.financialsService.findInvoicesByStudent(studentId);
  }
}
