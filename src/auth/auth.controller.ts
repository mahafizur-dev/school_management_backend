import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // <-- Import Guard
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ... register and login methods remain the same

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  // NEW PROTECTED ENDPOINT
  @UseGuards(JwtAuthGuard) // <-- Apply the auth guard
  @Get('profile')
  getProfile(@GetUser() user: User) {
    // Thanks to JwtStrategy and GetUser decorator, we have the user object
    return user;
  }

  // NEW ROLE-PROTECTED ENDPOINT
  @UseGuards(JwtAuthGuard, RolesGuard) // <-- Apply both guards
  @Roles(Role.Admin) // <-- Specify that only Admins can access this
  @Get('admin-data')
  getAdminData(@GetUser() user: User) {
    return {
      message: 'This is protected data for admins only.',
      user,
    };
  }
}
