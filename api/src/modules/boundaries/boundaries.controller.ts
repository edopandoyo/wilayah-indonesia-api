import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BoundariesService } from './boundaries.service';

@ApiTags('Boundaries (Polygons & Coordinates)')
@Controller('api/boundaries')
export class BoundariesController {
  constructor(private readonly boundariesService: BoundariesService) {}

  @Get(':code([\\w.]+)')
  @ApiOperation({ summary: 'Mendapatkan data batas wilayah (coordinates & polygon path) berdasarkan kode' })
  @ApiParam({ name: 'code', example: '11', description: 'Kode wilayah (Provinsi, Kab/Kota, Kecamatan, atau Desa)' })
  async findOne(@Param('code') code: string) {
    return this.boundariesService.findOne(code);
  }

  @Get(':code([\\w.]+)/children')
  @ApiOperation({ summary: 'Mendapatkan data boundaries seluruh sub-wilayah di bawah kode induk' })
  @ApiParam({ name: 'code', example: '11', description: 'Kode wilayah induk' })
  async findByParent(@Param('code') code: string) {
    return this.boundariesService.findByParent(code);
  }
}
