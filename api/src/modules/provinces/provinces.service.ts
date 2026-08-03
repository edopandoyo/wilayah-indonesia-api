import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Wilayah } from '../../entities/wilayah.entity';
import { getLogoUrl } from '../../common/utils/logo.util';

@Injectable()
export class ProvincesService {
  constructor(
    @InjectRepository(Wilayah)
    private readonly wilayahRepo: Repository<Wilayah>,
    private readonly configService: ConfigService,
  ) {}

  async findAll() {
    const list = await this.wilayahRepo.createQueryBuilder('w')
      .where('CHAR_LENGTH(w.kode) = :len', { len: 2 })
      .orderBy('w.nama', 'ASC')
      .getMany();

    return list.map(item => ({
      ...item,
      logo_url: getLogoUrl(item.kode, this.configService),
    }));
  }

  async findOne(code: string) {
    const province = await this.wilayahRepo.createQueryBuilder('w')
      .where('w.kode = :code AND CHAR_LENGTH(w.kode) = :len', { code, len: 2 })
      .getOne();

    if (!province) {
      throw new NotFoundException(`Provinsi dengan kode ${code} tidak ditemukan`);
    }
    return {
      ...province,
      logo_url: getLogoUrl(province.kode, this.configService),
    };
  }

  async findRegencies(code: string) {
    await this.findOne(code);
    const list = await this.wilayahRepo.createQueryBuilder('w')
      .where('w.kode LIKE :prefix AND CHAR_LENGTH(w.kode) = :len', { prefix: `${code}.%`, len: 5 })
      .orderBy('w.nama', 'ASC')
      .getMany();

    return list.map(item => ({
      ...item,
      logo_url: getLogoUrl(item.kode, this.configService),
    }));
  }
}
