import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('wilayah_penduduk')
export class WilayahPenduduk {
  @PrimaryColumn({ type: 'varchar', length: 13 })
  kode: string;

  @Column({ type: 'varchar', length: 100 })
  @Index('penduduk_nama_idx')
  nama: string;

  @Column({ type: 'int', default: 0 })
  pria: number;

  @Column({ type: 'int', default: 0 })
  wanita: number;

  @Column({ type: 'int', default: 0 })
  total: number;
}
