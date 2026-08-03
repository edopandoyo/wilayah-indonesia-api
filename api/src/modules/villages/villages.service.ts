import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wilayah } from '../../entities/wilayah.entity';

@Injectable()
export class VillagesService {
  constructor(
    @InjectRepository(Wilayah)
    private readonly wilayahRepo: Repository<Wilayah>,
  ) {}

  async findAll(districtCode?: string): Promise<Wilayah[]> {
    const qb = this.wilayahRepo.createQueryBuilder('w')
      .where('CHAR_LENGTH(w.kode) = :len', { len: 13 });

    if (districtCode) {
      qb.andWhere('w.kode LIKE :prefix', { prefix: `${districtCode}.%` });
    }

    return qb.orderBy('w.nama', 'ASC').getMany();
  }

  async findOne(code: string): Promise<Wilayah> {
    const village = await this.wilayahRepo.createQueryBuilder('w')
      .where('w.kode = :code AND CHAR_LENGTH(w.kode) = :len', { code, len: 13 })
      .getOne();

    if (!village) {
      throw new NotFoundException(`Desa/Kelurahan dengan kode ${code} tidak ditemukan`);
    }
    return village;
  }
}
