import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WilayahKodepos } from '../../entities/wilayah-kodepos.entity';
import { Wilayah } from '../../entities/wilayah.entity';

@Injectable()
export class KodeposService {
  constructor(
    @InjectRepository(WilayahKodepos)
    private readonly kodeposRepo: Repository<WilayahKodepos>,
    @InjectRepository(Wilayah)
    private readonly wilayahRepo: Repository<Wilayah>,
  ) {}

  async findByCode(kode: string) {
    const item = await this.kodeposRepo.findOne({ where: { kode } });
    if (!item) {
      throw new NotFoundException(`Data kode pos untuk kode wilayah ${kode} tidak ditemukan`);
    }

    const village = await this.wilayahRepo.findOne({ where: { kode } });

    return {
      kode: item.kode,
      kodepos: item.kodepos,
      nama: village ? village.nama : null,
    };
  }

  async searchByKodepos(kodepos: string, page = 1, limit = 20) {
    const qb = this.kodeposRepo
      .createQueryBuilder('kp')
      .leftJoinAndSelect(Wilayah, 'w', 'w.kode = kp.kode')
      .where('kp.kodepos = :kodepos', { kodepos });

    const total = await qb.getCount();
    const rawData = await this.kodeposRepo
      .createQueryBuilder('kp')
      .leftJoin(Wilayah, 'w', 'w.kode = kp.kode')
      .select(['kp.kode AS kode', 'kp.kodepos AS kodepos', 'w.nama AS nama'])
      .where('kp.kodepos = :kodepos', { kodepos })
      .orderBy('kp.kode', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    return {
      data: rawData,
      meta: {
        total,
        kodepos,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findAll(kodepos?: string, kode?: string, page = 1, limit = 20) {
    const qb = this.kodeposRepo.createQueryBuilder('kp')
      .leftJoin(Wilayah, 'w', 'w.kode = kp.kode')
      .select(['kp.kode AS kode', 'kp.kodepos AS kodepos', 'w.nama AS nama']);

    if (kodepos) {
      qb.andWhere('kp.kodepos LIKE :kodepos', { kodepos: `%${kodepos}%` });
    }

    if (kode) {
      qb.andWhere('kp.kode LIKE :kode', { kode: `${kode}%` });
    }

    const total = await qb.getCount();
    const data = await qb
      .orderBy('kp.kode', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit),
      },
    };
  }
}
