import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  // create a category
  async createCategory({ categoryName }) {
    const duplicate = await this.prismaService.category.findUnique({
      where: {
        category_name: categoryName,
      },
    });
    if (duplicate) {
      throw new ConflictException('category already exist');
    }
    await this.prismaService.category.create({
      data: {
        category_name: categoryName,
      },
    });
    const response = {
      status: 'success',
      data: {
        message: 'category successfully created',
        categoryName,
      },
    };
    return response;
  }

  // view all categories
  async getAllCategories() {
    const categories = await this.prismaService.category.findMany();
    const response = { categories };
    return response;
  }

  //get a single category
  async getCategory(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      select: {
        category_name: true,
        articles: {
          select: {
            title: true,
            article: true,
          },
        },
      },
    });

    if (!category) {
      throw new HttpException('no category found', 400);
    }
    return category;
  }

  // admin can delete a category
  async deleteCategory(name: string) {
    await this.prismaService.articles.deleteMany({
      where: {
        category_name: name,
      },
    });

    await this.prismaService.category.delete({
      where: {
        category_name: name,
      },
    });
    return {
      status: 'success',
      message: 'category and all its articles deleted successfully',
    };
  }
}
