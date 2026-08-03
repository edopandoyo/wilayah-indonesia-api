import { ConfigService } from '@nestjs/config';

export function getLogoUrl(code: string, configService?: ConfigService): string | null {
  if (!code) return null;
  const len = code.length;
  // Logos exist for Level 1 (Provinsi: len 2) & Level 2 (Kab/Kota: len 5)
  if (len !== 2 && len !== 5) {
    return null;
  }

  const baseUrl = configService
    ? configService.get<string>('MINIO_PUBLIC_URL', 'http://localhost/wilayah-logo')
    : (process.env.MINIO_PUBLIC_URL || 'http://localhost/wilayah-logo');

  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `${cleanBase}/${code}.png`;
}
