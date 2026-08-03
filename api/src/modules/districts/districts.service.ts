import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wilayah } from '../../entities/wilayah.entity';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(Wilayah)
    private readonly wilayahRepo: Repository<Wilayah>,
  ) {}

  async findAll(regencyCode?: string): Promise<Wilayah[]> {
    const qb = this.wilayahRepo.createQueryBuilder('w')
      .where('CHAR_LENGTH(w.kode) = :len', { len: 8 });

    if (regencyCode) {
      qb.andWhere('w.kode LIKE :prefix', { prefix: `${regencyCode}.%` });
    }

    return qb.orderBy('w.nama', 'ASC').getMany();
  }

  async findOne(code: string): Promise<Wilayah> {
    const district = await this.wilayahRepo.createQueryBuilder('w')
      .where('w.kode = :code AND CHAR_LENGTH(w.kode) = :len', { code, len: 8 })
      .getOne();

    if (!district) {
      throw new NotFoundException(`Kecamatan dengan kode ${code} tidak ditemukan`);
    }
    return district;
  }

  async findVillages(code: string): Promise<Wilayah[]> {
    await this.findOne(code);
    return this.wilayahRepo.createQueryBuilder('w')
      .where('w.kode LIKE :prefix AND CHAR_LENGTH(w.kode) = :len', { prefix: `${code}.%`, len: 13 })
      .orderBy('w.nama', 'ASC')
      .getMany();
  }
}
