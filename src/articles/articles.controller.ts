import {
  Body,
  Controller,
  Post,
  Get,
  ParseIntPipe,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { User } from 'src/user/decorators/user.decorator';
import { UserInfo } from 'src/user/utils/user.types';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dtos/articles.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Post('')
  async createArticle(@Body() body: ArticleDto, @User() user: UserInfo) {
    if (!user) throw new UnauthorizedException();
    return this.articleService.createArticle(body, user.id);
  }

  @Get()
  async getAllCategories(@User() user: UserInfo) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.articleService.getAllArticles();
  }

  @Get(':id')
  async getCategory(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.articleService.getArticle(id);
  }

  @Delete(':id')
  async deleteArticle(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    if (!user) {
      throw new UnauthorizedException();
    }
    const checkUser = user.id;
    const authUser = this.articleService.getArticle(id);
    const realUser = (await authUser).data.articleAuthor.id;
    if (checkUser !== realUser && !user.isAdmin) {
      throw new UnauthorizedException('you cannot delete this article');
    }
    return this.articleService.deleteArticle(id);
  }

  @Put(':id')
  async updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ArticleDto,
    @User() user: UserInfo,
  ) {
    if (!user) throw new UnauthorizedException();
    const checkUser = user.id;
    const authUser = this.articleService.getArticle(id);
    const realUser = (await authUser).data.articleAuthor.id;
    if (checkUser !== realUser) {
      throw new UnauthorizedException('you cannot edit this article');
    }
    return this.articleService.updateArticle(body, id);
  }
}
