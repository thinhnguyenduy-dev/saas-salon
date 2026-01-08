import { IsBoolean, IsString, IsArray, ValidateNested, IsIn, Matches, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BreakPeriodDto {
  @ApiProperty({ example: '12:00', description: 'Break start time in HH:mm format' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format (e.g., 09:00)',
  })
  start: string;

  @ApiProperty({ example: '13:00', description: 'Break end time in HH:mm format' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:mm format (e.g., 18:00)',
  })
  end: string;
}

export class BusinessHourDto {
  @ApiProperty({ 
    example: 'monday', 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    description: 'Day of the week'
  })
  @IsString()
  @IsIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

  @ApiProperty({ example: true, description: 'Whether the shop is open on this day' })
  @IsBoolean()
  isOpen: boolean;

  @ApiProperty({ example: '09:00', description: 'Opening time in HH:mm format', required: false })
  @ValidateIf((o) => o.isOpen === true)
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Open time must be in HH:mm format (e.g., 09:00)',
  })
  openTime: string | null;

  @ApiProperty({ example: '18:00', description: 'Closing time in HH:mm format', required: false })
  @ValidateIf((o) => o.isOpen === true)
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Close time must be in HH:mm format (e.g., 18:00)',
  })
  closeTime: string | null;

  @ApiProperty({ 
    type: [BreakPeriodDto], 
    description: 'Break periods during the day',
    required: false,
    default: []
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakPeriodDto)
  breaks: BreakPeriodDto[];
}

export class UpdateBusinessHoursDto {
  @ApiProperty({ 
    type: [BusinessHourDto],
    description: 'Complete weekly business hours schedule'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessHourDto)
  businessHours: BusinessHourDto[];
}
