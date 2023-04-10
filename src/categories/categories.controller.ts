import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Get,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { UserInfo } from 'src/user/utils/user.types';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dtos/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  async createCategory(@Body() body: CategoryDto, @User() user: UserInfo) {
    if (!user?.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.categoryService.createCategory(body);
  }

  @Get()
  async getAllCategories(@User() user: UserInfo) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategory(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.categoryService.getCategory(id);
  }

  @Delete(':name')
  async deleteCategory(@Param('name') name: string, @User() user: UserInfo) {
    if (!user?.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.categoryService.deleteCategory(name);
  }
}
