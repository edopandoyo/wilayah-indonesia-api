import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Wilayah } from '../../entities/wilayah.entity';
import { getLogoUrl } from '../../common/utils/logo.util';

@Injectable()
export class RegenciesService {
  constructor(
    @InjectRepository(Wilayah)
    private readonly wilayahRepo: Repository<Wilayah>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(provinceCode?: string) {
    const qb = this.wilayahRepo.createQueryBuilder('w')
      .where('CHAR_LENGTH(w.kode) = :len', { len: 5 });

    if (provinceCode) {
      qb.andWhere('w.kode LIKE :prefix', { prefix: `${provinceCode}.%` });
    }

    const list = await qb.orderBy('w.nama', 'ASC').getMany();
    return list.map(item => ({
      ...item,
      logo_url: getLogoUrl(item.kode, this.configService),
    }));
  }

  async findOne(code: string) {
    const regency = await this.wilayahRepo.createQueryBuilder('w')
      .where('w.kode = :code AND CHAR_LENGTH(w.kode) = :len', { code, len: 5 })
      .getOne();

    if (!regency) {
      throw new NotFoundException(`Kabupaten/Kota dengan kode ${code} tidak ditemukan`);
    }
    return {
      ...regency,
      logo_url: getLogoUrl(regency.kode, this.configService),
    };
  }

  async findDistricts(code: string): Promise<Wilayah[]> {
    await this.findOne(code);
    return this.wilayahRepo.createQueryBuilder('w')
      .where('w.kode LIKE :prefix AND CHAR_LENGTH(w.kode) = :len', { prefix: `${code}.%`, len: 8 })
      .orderBy('w.nama', 'ASC')
      .getMany();
  }
}
