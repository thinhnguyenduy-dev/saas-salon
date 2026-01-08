import { Controller, Get, Param, Query, Patch, Body, UseGuards, Request, ForbiddenException, Put, BadRequestException } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UpdateShopDto } from './dto/update-shop.dto';
import { UpdateBusinessHoursDto } from './dto/business-hours.dto';

@ApiTags('Shops (Marketplace)')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  @ApiOperation({ summary: 'Public search for shops (Geospatial & Text)' })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'district', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'maxDistance', required: false, type: Number, description: 'Meters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.shopsService.findAllPublic(query);
  }

  @Get(':slug/public')
  @ApiOperation({ summary: 'Get public shop profile by slug' })
  findOnePublic(@Param('slug') slug: string) {
    return this.shopsService.findOnePublic(slug);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-shop')
  @ApiOperation({ summary: 'Get your shop profile (Owner/Admin)' })
  getMyShop(@Request() req: any) {
      if (!req.user.shopId) {
          throw new ForbiddenException('User is not associated with any shop');
      }
      return this.shopsService.findOneById(req.user.shopId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('my-shop')
  @ApiOperation({ summary: 'Update your shop profile (Owner/Admin)' })
  @ApiBody({ type: UpdateShopDto })
  updateMyShop(@Request() req: any, @Body() body: UpdateShopDto) {
      if (!req.user.shopId) {
          throw new ForbiddenException('User is not associated with any shop');
      }
      return this.shopsService.update(req.user.shopId, body);
  }

  // Business Hours Endpoints

  @Get(':id/business-hours')
  @ApiOperation({ summary: 'Get business hours for a shop' })
  getBusinessHours(@Param('id') id: string) {
    return this.shopsService.getBusinessHours(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('my-shop/business-hours')
  @ApiOperation({ summary: 'Update business hours for your shop (Owner/Admin)' })
  @ApiBody({ type: UpdateBusinessHoursDto })
  updateBusinessHours(@Request() req: any, @Body() body: UpdateBusinessHoursDto) {
    if (!req.user.shopId) {
      throw new ForbiddenException('User is not associated with any shop');
    }
    return this.shopsService.updateBusinessHours(req.user.shopId, body);
  }

  @Get(':id/is-open')
  @ApiOperation({ summary: 'Check if shop is currently open' })
  isShopOpen(@Param('id') id: string) {
    return this.shopsService.isShopOpen(id);
  }

  @Get(':id/next-opening')
  @ApiOperation({ summary: 'Get next opening time for a shop' })
  getNextOpening(@Param('id') id: string) {
    return this.shopsService.getNextOpening(id);
  }
}
