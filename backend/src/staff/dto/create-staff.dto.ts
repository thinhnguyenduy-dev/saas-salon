import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class WorkShiftDto {
  @ApiProperty({ example: 1, description: '0=Sunday, 6=Saturday' })
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  endTime: string;
}

export class CreateStaffDto {
  @ApiProperty({ example: 'Alice Smith' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'alice@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: ['serviceId1', 'serviceId2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ type: [WorkShiftDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkShiftDto)
  @IsOptional()
  workSchedule?: WorkShiftDto[];

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  baseSalary?: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  commissionRate?: number;
}
