import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  shopId: string;

  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}
