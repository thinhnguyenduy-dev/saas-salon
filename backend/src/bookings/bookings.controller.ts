import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @Post('public')
  createPublic(@Body() createDto: CreatePublicBookingDto) {
    return this.bookingsService.createPublic(createDto);
  }

  @Public() // Or guarded? Let's make it public for now since guest bookings need it.
  @Post(':id/pay') // Wait, :id param might conflict with 'public' or others if they were params. 'public' is literal, so ok.
  async createPaymentIntent(@Param('id') id: string) {
      return this.bookingsService.createPaymentIntent(id);
  }

  @Public()
  @Get('slots')
  @ApiQuery({ name: 'date', required: true, type: String })
  @ApiQuery({ name: 'serviceIds', required: true, type: String }) // or array
  @ApiQuery({ name: 'staffId', required: false, type: String })
  getSlots(@Query() query: any) {
    return this.bookingsService.getAvailableSlots(query);
  }

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: User) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get('my-bookings')
  getMyBookings(@CurrentUser() user: User) {
    return this.bookingsService.getMyBookings(user);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'date', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  findAll(@Query() query: any, @CurrentUser() user: User) {
    return this.bookingsService.findAll(query, user);
  }

  // @Get(':id') ...

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto, @CurrentUser() user: User) {
    return this.bookingsService.update(id, updateBookingDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.remove(id, user);
  }
}
