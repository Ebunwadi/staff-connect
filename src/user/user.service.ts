import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginParams, SignupParams } from './utils/user.types';
import * as bcrypt from 'bcrypt';
import { generateJWT } from './utils/generateJwt';
import { response } from './utils/responses';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({
    email,
    password,
    firstName,
    lastName,
    address,
    department,
    isAdmin,
    jobRole,
    gender,
  }: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        address,
        job_role: jobRole,
        is_admin: isAdmin,
        gender,
        department,
      },
    });

    const { id } = user;

    const token = generateJWT({ isAdmin, email, id });
    return response('success', 'user succesfully created', token);
  }

  async login({ email, password }: LoginParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const hashedPassword = user.password;

    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    const { id } = user;
    const isAdmin = user.is_admin;

    const token = generateJWT({ isAdmin, email, id });
    return response('success', 'login successful', token);
  }
}
