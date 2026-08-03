import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WilayahBoundaries } from '../../entities/wilayah-boundaries.entity';
import { BoundariesController } from './boundaries.controller';
import { BoundariesService } from './boundaries.service';

@Module({
  imports: [TypeOrmModule.forFeature([WilayahBoundaries])],
  controllers: [BoundariesController],
  providers: [BoundariesService],
  exports: [BoundariesService],
})
export class BoundariesModule {}
