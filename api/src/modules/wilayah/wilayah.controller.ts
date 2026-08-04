import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { WilayahService } from './wilayah.service';

@ApiTags('Wilayah General & Search')
@Controller('api/wilayah')
export class WilayahController {
  constructor(private readonly wilayahService: WilayahService) {}

  @Get('search')
  @ApiOperation({ summary: 'Pencarian wilayah berdasarkan nama' })
  @ApiQuery({ name: 'name', required: true, example: 'Bandung', description: 'Kata kunci nama wilayah' })
  @ApiQuery({ name: 'level', required: false, example: 2, description: 'Tingkat wilayah: 1 (Provinsi), 2 (Kab/Kota), 3 (Kecamatan), 4 (Kelurahan/Desa)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Nomor halaman (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, example: 20, description: 'Jumlah item per halaman (default: 20)' })
  async search(
    @Query('name') name: string,
    @Query('level') level?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.wilayahService.search(name, level ? Number(level) : undefined, page, limit);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Mendapatkan detail wilayah berdasarkan kode' })
  @ApiParam({ name: 'code', example: '32.73', description: 'Kode wilayah (Provinsi/Kab/Kec/Kel)' })
  async findByCode(@Param('code') code: string) {
    return this.wilayahService.findByCode(code);
  }
}
