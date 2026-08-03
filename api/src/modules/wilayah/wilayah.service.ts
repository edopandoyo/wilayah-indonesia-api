import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Wilayah } from '../../entities/wilayah.entity';
import { WilayahPenduduk } from '../../entities/wilayah-penduduk.entity';
import { WilayahLuas } from '../../entities/wilayah-luas.entity';
import { WilayahBoundaries } from '../../entities/wilayah-boundaries.entity';
import { getLogoUrl } from '../../common/utils/logo.util';

@Injectable()
export class WilayahService {
  constructor(
    @InjectRepository(Wilayah)
    private readonly wilayahRepo: Repository<Wilayah>,
    @InjectRepository(WilayahPenduduk)
    private readonly pendudukRepo: Repository<WilayahPenduduk>,
    @InjectRepository(WilayahLuas)
    private readonly luasRepo: Repository<WilayahLuas>,
    @InjectRepository(WilayahBoundaries)
    private readonly boundariesRepo: Repository<WilayahBoundaries>,
    private readonly configService: ConfigService,
  ) {}

  async search(name: string, level?: number, page = 1, limit = 20) {
    const qb = this.wilayahRepo.createQueryBuilder('w')
      .where('LOWER(w.nama) LIKE LOWER(:name)', { name: `%${name}%` });

    if (level === 1) {
      qb.andWhere('CHAR_LENGTH(w.kode) = 2');
    } else if (level === 2) {
      qb.andWhere('CHAR_LENGTH(w.kode) = 5');
    } else if (level === 3) {
      qb.andWhere('CHAR_LENGTH(w.kode) = 8');
    } else if (level === 4) {
      qb.andWhere('CHAR_LENGTH(w.kode) = 13');
    }

    const total = await qb.getCount();
    const data = await qb
      .orderBy('w.kode', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const items = data.map((item) => {
      let levelName = 'Unknown';
      const len = item.kode.length;
      if (len === 2) levelName = 'Provinsi';
      else if (len === 5) levelName = 'Kabupaten/Kota';
      else if (len === 8) levelName = 'Kecamatan';
      else if (len === 13) levelName = 'Desa/Kelurahan';

      return {
        ...item,
        level: levelName,
        level_code: len === 2 ? 1 : len === 5 ? 2 : len === 8 ? 3 : 4,
        logo_url: getLogoUrl(item.kode, this.configService),
      };
    });

    return {
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findByCode(code: string) {
    const item = await this.wilayahRepo.findOne({ where: { kode: code } });
    if (!item) {
      throw new NotFoundException(`Wilayah dengan kode ${code} tidak ditemukan`);
    }

    const len = item.kode.length;
    let levelName = 'Unknown';
    let parentCodes: { province?: string; regency?: string; district?: string } = {};

    if (len === 2) {
      levelName = 'Provinsi';
    } else if (len === 5) {
      levelName = 'Kabupaten/Kota';
      parentCodes.province = code.substring(0, 2);
    } else if (len === 8) {
      levelName = 'Kecamatan';
      parentCodes.province = code.substring(0, 2);
      parentCodes.regency = code.substring(0, 5);
    } else if (len === 13) {
      levelName = 'Desa/Kelurahan';
      parentCodes.province = code.substring(0, 2);
      parentCodes.regency = code.substring(0, 5);
      parentCodes.district = code.substring(0, 8);
    }

    // Additional info
    const [penduduk, luas, boundary] = await Promise.all([
      this.pendudukRepo.findOne({ where: { kode: code } }),
      this.luasRepo.findOne({ where: { kode: code } }),
      this.boundariesRepo.findOne({ where: { kode: code } }),
    ]);

    let coordinates: { lat: number; lng: number } | null = null;
    let polygonPath: any = null;
    if (boundary) {
      coordinates = { lat: boundary.lat, lng: boundary.lng };
      try {
        if (boundary.path && (boundary.path.startsWith('[') || boundary.path.startsWith('{'))) {
          polygonPath = JSON.parse(boundary.path);
        } else {
          polygonPath = boundary.path;
        }
      } catch (e) {
        polygonPath = boundary.path;
      }
    }

    return {
      ...item,
      level: levelName,
      logo_url: getLogoUrl(item.kode, this.configService),
      parents: parentCodes,
      coordinates,
      boundary: polygonPath,
      penduduk: penduduk || null,
      luas: luas ? luas.luas : null,
    };
  }
}
