import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('wilayah_boundaries')
export class WilayahBoundaries {
  @PrimaryColumn({ type: 'varchar', length: 13 })
  kode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nama: string;

  @Column({ type: 'double precision', nullable: true })
  lat: number;

  @Column({ type: 'double precision', nullable: true })
  lng: number;

  @Column({ type: 'text', nullable: true })
  path: string;

  @Column({ type: 'int2', default: 1 })
  status: number;
}
