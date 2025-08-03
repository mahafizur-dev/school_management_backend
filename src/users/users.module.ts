import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Makes the User repository available
  providers: [UsersService],
  exports: [UsersService], // Export so other modules (like AuthModule) can use it
})
export class UsersModule {}
