import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wilayah } from '../../entities/wilayah.entity';
import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wilayah])],
  controllers: [DistrictsController],
  providers: [DistrictsService],
  exports: [DistrictsService],
})
export class DistrictsModule {}
