import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateBanDto } from './dto/create-ban.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get('manager/:id')
  getManager(
    @Param('id', ParseIntPipe) id: number
  ) {

    return this.usersService.getManager(id)
  }


  @Get()
  getUser(
  ) {
    return this.usersService.getAllUsers()
  }

}
