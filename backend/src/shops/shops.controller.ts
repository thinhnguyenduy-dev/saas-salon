import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Shops (Marketplace)')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  @ApiOperation({ summary: 'Public search for shops (Geospatial & Text)' })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'maxDistance', required: false, type: Number, description: 'Meters' })
  findAll(@Query() query: any) {
    return this.shopsService.findAllPublic(query);
  }

  @Get(':slug/public')
  @ApiOperation({ summary: 'Get public shop profile by slug' })
  findOnePublic(@Param('slug') slug: string) {
    return this.shopsService.findOnePublic(slug);
  }
}
