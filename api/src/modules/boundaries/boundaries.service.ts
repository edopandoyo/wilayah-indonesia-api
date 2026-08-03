import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WilayahBoundaries } from '../../entities/wilayah-boundaries.entity';

@Injectable()
export class BoundariesService {
  constructor(
    @InjectRepository(WilayahBoundaries)
    private readonly boundariesRepo: Repository<WilayahBoundaries>,
  ) {}

  async findOne(code: string) {
    const boundary = await this.boundariesRepo.findOne({ where: { kode: code } });
    if (!boundary) {
      throw new NotFoundException(`Data boundary/geometris untuk kode ${code} tidak ditemukan`);
    }

    let parsedPath: any = boundary.path;
    try {
      if (boundary.path && (boundary.path.startsWith('[') || boundary.path.startsWith('{'))) {
        parsedPath = JSON.parse(boundary.path);
      }
    } catch (e) {
      parsedPath = boundary.path;
    }

    return {
      kode: boundary.kode,
      nama: boundary.nama,
      lat: boundary.lat,
      lng: boundary.lng,
      status: boundary.status,
      path: parsedPath,
    };
  }

  async findByParent(code: string) {
    const boundaries = await this.boundariesRepo.createQueryBuilder('b')
      .where('b.kode LIKE :prefix', { prefix: `${code}.%` })
      .orderBy('b.kode', 'ASC')
      .getMany();

    return boundaries.map((b) => {
      let parsedPath: any = b.path;
      try {
        if (b.path && (b.path.startsWith('[') || b.path.startsWith('{'))) {
          parsedPath = JSON.parse(b.path);
        }
      } catch (e) {
        parsedPath = b.path;
      }
      return {
        kode: b.kode,
        nama: b.nama,
        lat: b.lat,
        lng: b.lng,
        status: b.status,
        path: parsedPath,
      };
    });
  }
}
