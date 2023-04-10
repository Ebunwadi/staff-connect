import {
  Controller,
  Post,
  Body,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { LoginDto, SignupDto } from './dtos/user.dto';
import { UserService } from './user.service';
import { UserInfo } from './utils/user.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() body: SignupDto, @User() user: UserInfo) {
    if (!user?.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.userService.signup(body);
  }

  @HttpCode(200)
  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }
}
