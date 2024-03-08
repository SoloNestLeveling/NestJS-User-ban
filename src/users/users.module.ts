import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { BanModel } from './entity/ban.entity';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersModel,
      BanModel,
    ])
  ],
  exports: [UsersService],
  controllers: [UsersController, BanController],
  providers: [UsersService, BanService],
})
export class UsersModule { }
