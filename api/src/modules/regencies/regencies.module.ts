import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wilayah } from '../../entities/wilayah.entity';
import { RegenciesController } from './regencies.controller';
import { RegenciesService } from './regencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wilayah])],
  controllers: [RegenciesController],
  providers: [RegenciesService],
  exports: [RegenciesService],
})
export class RegenciesModule {}
