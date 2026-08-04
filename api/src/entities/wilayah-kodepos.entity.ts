import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('wilayah_kodepos')
export class WilayahKodepos {
  @PrimaryColumn({ type: 'varchar', length: 13 })
  kode: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  @Index('kodepos_idx')
  kodepos: string;
}
