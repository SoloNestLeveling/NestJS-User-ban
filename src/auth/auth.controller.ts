import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IsPublic } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('register/email')
  @IsPublic()
  registerUser(
    @Body() dto: CreateUserDto
  ) {
    return this.authService.registerWithEmail(dto)
  };


  @Post('login/email')
  @IsPublic()
  loginUser(
    @Headers('authorization') rawToken: string
  ) {
    return this.authService.loginUser(rawToken)
  }
}
