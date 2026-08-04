import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RegenciesService } from './regencies.service';
import { Wilayah } from '../../entities/wilayah.entity';

@ApiTags('Regencies')
@Controller('api/regencies')
export class RegenciesController {
  constructor(private readonly regenciesService: RegenciesService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar Kabupaten/Kota' })
  @ApiQuery({ name: 'province_code', required: false, example: '11', description: 'Filter berdasarkan kode Provinsi (contoh: 11)' })
  async findAll(@Query('province_code') provinceCode?: string): Promise<Wilayah[]> {
    return this.regenciesService.findAll(provinceCode);
  }

  @Get(':code([\\w.]+)')
  @ApiOperation({ summary: 'Mendapatkan detail Kabupaten/Kota berdasarkan kode' })
  @ApiParam({ name: 'code', example: '11.01', description: 'Kode 5-character Kabupaten/Kota (contoh: 11.01)' })
  async findOne(@Param('code') code: string): Promise<Wilayah> {
    return this.regenciesService.findOne(code);
  }

  @Get(':code([\\w.]+)/districts')
  @ApiOperation({ summary: 'Mendapatkan daftar Kecamatan di Kabupaten/Kota tersebut' })
  @ApiParam({ name: 'code', example: '11.01', description: 'Kode 5-character Kabupaten/Kota' })
  async findDistricts(@Param('code') code: string): Promise<Wilayah[]> {
    return this.regenciesService.findDistricts(code);
  }
}
