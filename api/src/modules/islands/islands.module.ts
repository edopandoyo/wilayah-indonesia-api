import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WilayahPulau } from '../../entities/wilayah-pulau.entity';
import { IslandsController } from './islands.controller';
import { IslandsService } from './islands.service';

@Module({
  imports: [TypeOrmModule.forFeature([WilayahPulau])],
  controllers: [IslandsController],
  providers: [IslandsService],
  exports: [IslandsService],
})
export class IslandsModule {}
