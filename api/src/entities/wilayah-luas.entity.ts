import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('wilayah_luas')
export class WilayahLuas {
  @PrimaryColumn({ type: 'varchar', length: 13 })
  kode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index('luas_nama_idx')
  nama: string;

  @Column({ type: 'double precision', default: 0 })
  luas: number;
}
