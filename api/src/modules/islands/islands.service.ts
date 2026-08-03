import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WilayahPulau } from '../../entities/wilayah-pulau.entity';

@Injectable()
export class IslandsService {
  constructor(
    @InjectRepository(WilayahPulau)
    private readonly pulauRepo: Repository<WilayahPulau>,
  ) {}

  async findAll(provinceCode?: string, page = 1, limit = 50) {
    const qb = this.pulauRepo.createQueryBuilder('p');

    if (provinceCode) {
      qb.where('p.kode LIKE :prefix', { prefix: `${provinceCode}.%` });
    }

    const total = await qb.getCount();
    const data = await qb
      .orderBy('p.nama', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

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

  async findOne(code: string): Promise<WilayahPulau> {
    const island = await this.pulauRepo.findOne({ where: { kode: code } });
    if (!island) {
      throw new NotFoundException(`Pulau dengan kode ${code} tidak ditemukan`);
    }
    return island;
  }
}
