import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'customerId123' })
  @IsMongoId()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: ['serviceId1', 'serviceId2'] })
  @IsMongoId({ each: true })
  @IsNotEmpty()
  services: string[];

  @ApiProperty({ example: 'staffId123', required: false })
  @IsMongoId()
  @IsOptional()
  staffId?: string;

  @ApiProperty({ example: '2023-10-25T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: 'Notes about the booking', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
