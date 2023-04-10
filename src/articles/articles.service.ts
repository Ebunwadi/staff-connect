import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createArticle } from './utils/articles.types';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  // create an article
  async createArticle(
    { title, article, category }: createArticle,
    userId: number,
  ) {
    const findCategory = await this.prisma.category.findUnique({
      where: {
        category_name: category,
      },
    });
    if (!findCategory) {
      throw new HttpException('category not found', HttpStatus.BAD_REQUEST);
    }
    const createdArticle = await this.prisma.articles.create({
      data: {
        title,
        article,
        category_name: category,
        user_id: userId,
      },
      select: {
        user: {
          select: {
            first_name: true,
            email: true,
          },
        },
      },
    });
    const response = {
      status: 'success',
      data: {
        message: 'article successfully created',
        title,
        article,
        author: createdArticle.user,
      },
    };

    return response;
  }

  //get all articles
  async getAllArticles() {
    const articles = await this.prisma.articles.findMany();
    if (articles.length < 1) {
      return { note: 'article not found' };
    }
    const response = { articles };
    return response;
  }

  // get a single article
  async getArticle(id: number) {
    const article = await this.prisma.articles.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        article: true,
        is_flagged: true,
        category_name: true,
        user: {
          select: {
            id: true,
            first_name: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      throw new HttpException('article not found', HttpStatus.BAD_REQUEST);
    }

    const response = {
      status: 'success',
      data: {
        title: article.title,
        content: article.article,
        isFlagged: article.is_flagged,
        category: article.category_name,
        articleAuthor: article.user,
      },
    };
    return response;
  }

  // delete an article
  async deleteArticle(id: number) {
    await this.prisma.articles.delete({
      where: {
        id,
      },
    });
    return {
      status: 'success',
      message: 'article deleted successfully',
    };
  }

  // update an article
  async updateArticle({ title, article, category }: createArticle, id: number) {
    const getArticle = await this.prisma.articles.findUnique({
      where: {
        id,
      },
      select: {
        user: {
          select: {
            first_name: true,
            email: true,
          },
        },
      },
    });
    if (!getArticle) {
      throw new HttpException('article not found', HttpStatus.BAD_REQUEST);
    }
    await this.prisma.articles.update({
      where: {
        id,
      },
      data: {
        title,
        article,
        category_name: category,
      },
    });
    const response = {
      status: 'success',
      data: {
        message: 'article successfully updated',
        title,
        article,
        author: getArticle.user,
      },
    };

    return response;
  }
}
