import { IsDateString, IsUUID, IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicBookingDto {
  @ApiProperty({ example: ['serviceId1', 'serviceId2'] })
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  services: string[];

  @ApiProperty({ example: 'staffId123', required: false })
  @IsUUID()
  @IsOptional()
  staffId?: string;

  @ApiProperty({ example: 'shopId123' })
  @IsUUID()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty({ example: '2023-10-25T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  // Guest Details
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  guestEmail?: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  guestPhone: string;
}
