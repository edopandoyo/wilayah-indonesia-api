import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProvincesService } from './provinces.service';
import { Wilayah } from '../../entities/wilayah.entity';

@ApiTags('Provinces')
@Controller('api/provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar semua provinsi' })
  @ApiResponse({ status: 200, description: 'Daftar provinsi berhasil diambil' })
  async findAll(): Promise<Wilayah[]> {
    return this.provincesService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Mendapatkan detail provinsi berdasarkan kode' })
  @ApiParam({ name: 'code', example: '11', description: 'Kode 2-digit Provinsi (contoh: 11 for Aceh)' })
  async findOne(@Param('code') code: string): Promise<Wilayah> {
    return this.provincesService.findOne(code);
  }

  @Get(':code/regencies')
  @ApiOperation({ summary: 'Mendapatkan daftar Kabupaten/Kota di provinsi tertentu' })
  @ApiParam({ name: 'code', example: '11', description: 'Kode 2-digit Provinsi' })
  async findRegencies(@Param('code') code: string): Promise<Wilayah[]> {
    return this.provincesService.findRegencies(code);
  }
}
