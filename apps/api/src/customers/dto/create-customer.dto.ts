import { IsEnum, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MembershipTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  // @IsPhoneNumber() // Strict validation can be tricky with international formats, keeping string for now or use library
  phone: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'BRONZE', enum: MembershipTier, required: false })
  @IsEnum(MembershipTier)
  @IsOptional()
  membershipTier?: MembershipTier;

  @ApiProperty({ example: ['VIP', 'Referral'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
