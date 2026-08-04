import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DistrictsService } from './districts.service';
import { Wilayah } from '../../entities/wilayah.entity';

@ApiTags('Districts')
@Controller('api/districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar Kecamatan' })
  @ApiQuery({ name: 'regency_code', required: false, example: '11.01', description: 'Filter berdasarkan kode Kabupaten/Kota (contoh: 11.01)' })
  async findAll(@Query('regency_code') regencyCode?: string): Promise<Wilayah[]> {
    return this.districtsService.findAll(regencyCode);
  }

  @Get(':code([\\w.]+)')
  @ApiOperation({ summary: 'Mendapatkan detail Kecamatan berdasarkan kode' })
  @ApiParam({ name: 'code', example: '11.01.01', description: 'Kode 8-character Kecamatan (contoh: 11.01.01)' })
  async findOne(@Param('code') code: string): Promise<Wilayah> {
    return this.districtsService.findOne(code);
  }

  @Get(':code([\\w.]+)/villages')
  @ApiOperation({ summary: 'Mendapatkan daftar Desa/Kelurahan di Kecamatan tersebut' })
  @ApiParam({ name: 'code', example: '11.01.01', description: 'Kode 8-character Kecamatan' })
  async findVillages(@Param('code') code: string): Promise<Wilayah[]> {
    return this.districtsService.findVillages(code);
  }
}
