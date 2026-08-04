import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { KodeposService } from './kodepos.service';

@ApiTags('Kode Pos')
@Controller('api/kodepos')
export class KodeposController {
  constructor(private readonly kodeposService: KodeposService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar data kode pos dengan filter dan paginasi' })
  @ApiQuery({ name: 'kodepos', required: false, example: '23773', description: 'Filter berdasarkan angka kode pos' })
  @ApiQuery({ name: 'kode', required: false, example: '11.01.01', description: 'Filter berdasarkan kode wilayah (contoh: 11.01.01)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Halaman data (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, example: 20, description: 'Jumlah item per halaman (default: 20)' })
  async findAll(
    @Query('kodepos') kodepos?: string,
    @Query('kode') kode?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.kodeposService.findAll(kodepos, kode, Number(page), Number(limit));
  }

  @Get('search')
  @ApiOperation({ summary: 'Pencarian wilayah berdasarkan angka kode pos 5 digit' })
  @ApiQuery({ name: 'kodepos', required: true, example: '23773', description: '5 digit angka kode pos' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Halaman data (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, example: 20, description: 'Jumlah item per halaman (default: 20)' })
  async searchByKodepos(
    @Query('kodepos') kodepos: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.kodeposService.searchByKodepos(kodepos, Number(page), Number(limit));
  }

  @Get(':code')
  @ApiOperation({ summary: 'Mendapatkan kode pos berdasarkan kode wilayah (desa/kelurahan)' })
  @ApiParam({ name: 'code', example: '11.01.01.2001', description: 'Kode 13-character Desa/Kelurahan' })
  async findByCode(@Param('code') code: string) {
    return this.kodeposService.findByCode(code);
  }
}
