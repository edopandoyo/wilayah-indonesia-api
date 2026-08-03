import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('wilayah')
export class Wilayah {
  @PrimaryColumn({ type: 'varchar', length: 13 })
  kode: string;

  @Column({ type: 'varchar', length: 100 })
  @Index('wilayah_nama_idx')
  nama: string;
}
