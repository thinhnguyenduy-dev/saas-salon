import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Hair' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '#000000', required: false })
  @IsString()
  @IsOptional()
  color?: string;
}
