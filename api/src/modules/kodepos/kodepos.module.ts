import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WilayahKodepos } from '../../entities/wilayah-kodepos.entity';
import { Wilayah } from '../../entities/wilayah.entity';
import { KodeposService } from './kodepos.service';
import { KodeposController } from './kodepos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WilayahKodepos, Wilayah])],
  controllers: [KodeposController],
  providers: [KodeposService],
  exports: [KodeposService],
})
export class KodeposModule {}
