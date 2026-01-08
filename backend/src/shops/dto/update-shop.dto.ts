import { IsOptional, IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShopDto {
  @ApiProperty({ example: 'My Awesome Salon', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'The best salon in town', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'contact@salon.com', required: false })
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  contactPhone?: string;
    
  @ApiProperty({ example: 40.7128, required: false })
  @IsNumber()
  @IsOptional()
  lat?: number;
    
  @ApiProperty({ example: -74.0060, required: false })
  @IsNumber()
  @IsOptional()
  lng?: number;

  @ApiProperty({ example: ['haircut', 'massage'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
    
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
