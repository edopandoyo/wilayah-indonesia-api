import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wilayah } from '../../entities/wilayah.entity';
import { VillagesController } from './villages.controller';
import { VillagesService } from './villages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wilayah])],
  controllers: [VillagesController],
  providers: [VillagesService],
  exports: [VillagesService],
})
export class VillagesModule {}
