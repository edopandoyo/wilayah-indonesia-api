import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wilayah } from '../../entities/wilayah.entity';
import { WilayahPenduduk } from '../../entities/wilayah-penduduk.entity';
import { WilayahLuas } from '../../entities/wilayah-luas.entity';
import { WilayahBoundaries } from '../../entities/wilayah-boundaries.entity';
import { WilayahController } from './wilayah.controller';
import { WilayahService } from './wilayah.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wilayah, WilayahPenduduk, WilayahLuas, WilayahBoundaries])],
  controllers: [WilayahController],
  providers: [WilayahService],
  exports: [WilayahService],
})
export class WilayahModule {}
