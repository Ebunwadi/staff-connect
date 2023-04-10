import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  categoryName: string;
}
