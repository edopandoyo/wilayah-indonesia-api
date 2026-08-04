import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { VillagesService } from './villages.service';
import { Wilayah } from '../../entities/wilayah.entity';

@ApiTags('Villages')
@Controller('api/villages')
export class VillagesController {
  constructor(private readonly villagesService: VillagesService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar Desa/Kelurahan' })
  @ApiQuery({ name: 'district_code', required: false, example: '11.01.01', description: 'Filter berdasarkan kode Kecamatan (contoh: 11.01.01)' })
  async findAll(@Query('district_code') districtCode?: string): Promise<Wilayah[]> {
    return this.villagesService.findAll(districtCode);
  }

  @Get(':code([\\w.]+)')
  @ApiOperation({ summary: 'Mendapatkan detail Desa/Kelurahan berdasarkan kode' })
  @ApiParam({ name: 'code', example: '11.01.01.2001', description: 'Kode 13-character Desa/Kelurahan (contoh: 11.01.01.2001)' })
  async findOne(@Param('code') code: string): Promise<Wilayah> {
    return this.villagesService.findOne(code);
  }
}
