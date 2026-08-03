import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('wilayah_pulau')
export class WilayahPulau {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  kode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index('pulau_nama_idx')
  nama: string;

  @Column({ type: 'double precision', nullable: true })
  lat: number;

  @Column({ type: 'double precision', nullable: true })
  lng: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  status: string;

  @Column({ type: 'double precision', nullable: true })
  luas: number;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
