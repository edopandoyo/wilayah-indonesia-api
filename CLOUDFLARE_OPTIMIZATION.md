# Panduan Optimasi Cloudflare, Egress, & VPS Dokploy (2 vCPU / 2GB RAM)

Dokumen ini berisi panduan langkah demi langkah untuk mengonfigurasi **Cloudflare CDN** dan **VPS Dokploy** agar API Wilayah Indonesia bebas lonjakan Egress/Bandwidth dan stabil di VPS RAM 2GB.

---

## ☁️ 1. Konfigurasi Cloudflare Edge Caching ("Zero Egress Architecture")

Karena data Wilayah Indonesia pada dasarnya adalah **Read-Only / Statis**, pastikan Cloudflare diatur untuk mempublikasikan cache di ratusan *Data Center Edge* milik Cloudflare.

### A. Buat Cache Rule di Cloudflare Dashboard
1. Buka dashboard Cloudflare -> Pilih domain Anda (`domainanda.com`).
2. Masuk ke menu **Caching** -> **Cache Rules** -> Klik **Create Rule**.
3. Atur kriteria sebagai berikut:
   * **Rule Name**: `Cache All API & MinIO Logos`
   * **If incoming requests match...**: `(http.request.full_uri contains "/api/") or (http.request.full_uri contains "/wilayah-logo/")`
   * **Cache status**: **Eligible for cache**
   * **Edge Cache TTL**: `Ignore origin header, use fixed TTL` -> Pilih **1 month** (30 hari).
   * **Browser Cache TTL**: `Respect origin header` (Backend mengirim 1 hari).

> 💡 **Hasil**: **90-99% dari semua request pengunjung akan dijawab langsung oleh Cloudflare Edge**. VPS Dokploy Anda hanya dipanggil saat *Cache Miss* (0.01% - 1% traffic). **Penggunaan Egress VPS turun drastis mendekati 0 MB**.

---

## 🚦 2. Konfigurasi Cloudflare Rate Limiting (Proteksi Scraper & Bot)

Meskipun API dibuka gratis tanpa API Key, cegah pemakaian ugal-ugalan atau scraper liar yang mencoba men-download seluruh database berulang kali:

1. Buka dashboard Cloudflare -> **Security** -> **WAF** -> **Rate limiting rules**.
2. Klik **Create Rule**:
   * **Rule Name**: `API Rate Limit per IP`
   * **Field**: `URI Path` -> `starts with` -> `/api/`
   * **Action**: `Block` atau `Interactive Challenge (Captcha)`
   * **With status**: `429`
   * **Rate Limit**: **100 requests per 1 minute per IP address**.

---

## ⚡ 3. Aktifkan Brotli & Auto-Minify di Cloudflare

GeoJSON Boundaries & JSON lists akan terkompres secara otomatis:
1. Buka dashboard Cloudflare -> **Speed** -> **Optimization**.
2. **Brotli**: Centang **On**.
3. **Auto Minify**: Centang **HTML**, **CSS**, **JS**.

---

## 💾 4. Wajib: Aktifkan SWAP Memory 2GB di VPS Dokploy

Dengan spesifikasi RAM 2GB, jalannya 4 container Docker (`PostgreSQL`, `NestJS`, `MinIO`, `Nginx`) berisiko mengalami *Out-Of-Memory (OOM)* jika terjadi lonjakan trafik.

Jalankan perintah berikut di terminal SSH VPS Anda untuk membuat SWAP Memory 2GB:

```bash
# 1. Buat file swap 2GB
sudo fallocate -l 2G /swapfile

# 2. Atur permission aman
sudo chmod 600 /swapfile

# 3. Format sebagai swap space
sudo mkswap /swapfile

# 4. Aktifkan swap
sudo swapon /swapfile

# 5. Buat permanen saat VPS direboot
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 6. Verifikasi swap aktif
free -h
```

---

## 🔍 5. Hasil Optimasi yang Berhasil Diterapkan di Aplikasi

1. **NestJS (`/api`)**:
   - `compression` (Gzip) aktif untuk mereduksi ukuran respons JSON/GeoJSON hingga 85%.
   - `CacheControlInterceptor` otomatis menyertakan header `Cache-Control: public, max-age=86400, s-maxage=2592000` pada semua GET request.
   - `@nestjs/throttler` membatasi request backend max 60 req/menit per IP sebagai proteksi cadangan.
   - Trust Proxy diaktifkan agar IP asli pengunjung dari Cloudflare terdeteksi dengan tepat.
2. **Nginx Proxy (`/web`)**:
   - Nginx Gzip level 6 diaktifkan untuk stream data GeoJSON/JSON secara optimal.
   - Logo MinIO (`/wilayah-logo/*`) dikirim dengan header cache `30 Hari` (`immutable`), mencegah panggillan gambar berulang.
