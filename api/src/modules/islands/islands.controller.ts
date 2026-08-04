import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { IslandsService } from './islands.service';

@ApiTags('Islands')
@Controller('api/islands')
export class IslandsController {
  constructor(private readonly islandsService: IslandsService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar pulau-pulau di Indonesia' })
  @ApiQuery({ name: 'province_code', required: false, example: '11', description: 'Filter berdasarkan kode Provinsi' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  async findAll(
    @Query('province_code') provinceCode?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.islandsService.findAll(provinceCode, page, limit);
  }

  @Get(':code([\\w.]+)')
  @ApiOperation({ summary: 'Mendapatkan detail pulau berdasarkan kode' })
  @ApiParam({ name: 'code', example: '11.01.40001', description: 'Kode unik pulau' })
  async findOne(@Param('code') code: string) {
    return this.islandsService.findOne(code);
  }
}
