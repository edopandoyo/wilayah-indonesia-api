# Panduan Deployment Projek Wilayah Indonesia ke Dokploy VPS

Panduan ini berisi langkah demi langkah untuk mengunggah (push) projek ini ke **GitHub** dan mempublikasikannya (deploy) di VPS menggunakan **Dokploy**.

---

## 📋 Syarat & Prasyarat
1. Akun GitHub & Repository baru (misal: `https://github.com/username/wilayah-indonesia`).
2. Server Dokploy VPS yang sudah berjalan (Dokploy terinstall di VPS).

---

## 🚀 Langkah 1: Push Kode ke GitHub

Buka terminal di root projek ini dan jalankan perintah Git berikut:

```bash
# 1. Inisialisasi Git repository (jika belum)
git init

# 2. Tambahkan semua file projek
git add .

# 3. Commit awal projek
git commit -m "feat: Wilayah Indonesia REST API, MinIO Logo, Boundaries GeoJSON, and React UI"

# 4. Ubah nama branch utama ke main
git branch -M main

# 5. Hubungkan ke GitHub repository Anda (Ganti dengan URL repository Anda)
git remote add origin https://github.com/USERNAME/wilayah-indonesia.git

# 6. Push kode ke GitHub
git push -u origin main
```

---

## ⚙️ Langkah 2: Deploy di Dokploy VPS

1. Masuk ke Dashboard **Dokploy** VPS Anda.
2. Klik tombol **Projects** -> Pilih / Buat Project Baru.
3. Klik **Create Service** -> Pilih **Compose** (Docker Compose).
4. Berikan Nama Aplikasi (misal: `wilayah-indonesia-app`).
5. Pada tab **Source**:
   - Provider: **GitHub**.
   - Repository: Pilih repository `wilayah-indonesia`.
   - Branch: `main`.
   - Compose Path: `docker-compose.yml`.

---

## 🔑 Langkah 3: Konfigurasi Environment Variables di Dokploy

Masuk ke tab **Environment Variables** di Dokploy, salin dan atur konfigurasi berikut:

```env
# Database PostgreSQL
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres_password_vps_anda
DB_NAME=wilayah_db

# MinIO Object Storage
MINIO_ROOT_USER=admin_vps_anda
MINIO_ROOT_PASSWORD=password_minio_vps_anda
MINIO_BUCKET_NAME=wilayah-logo

# URL Publik Logo MinIO (Ubah sesuai IP VPS atau Domain Dokploy Anda)
# Jika menggunakan Domain/Subdomain:
MINIO_PUBLIC_URL=https://wilayah.domainanda.com/wilayah-logo
# Atau jika menggunakan IP VPS:
# MINIO_PUBLIC_URL=http://IP_VPS_ANDA/wilayah-logo

# NestJS API Port
PORT=3000

# React Frontend Port (Ubah jika port 8080 di VPS sudah terpakai)
WEB_PORT=8080

# React Frontend (Biarkan kosong jika berjalan dalam 1 domain via Nginx Proxy)
VITE_API_BASE_URL=
VITE_MINIO_PUBLIC_URL=
```

> 💡 **Tips Domain & Reverse Proxy Dokploy**:
> - Traefik/Dokploy menggunakan Port `80` bawaan host VPS. Pengaturan `WEB_PORT=8080` mencegah bentrok port `80` di Dokploy (`Bind for 0.0.0.0:80 failed`).
> - Di Dokploy pada menu **Domain** / **Traefik Routing**, tambahkan domain Anda (misal: `wilayah.domainanda.com`) dan arahkan **Container Port** ke `80` (atau Host Port `8080`).
> - Nginx bawaan container `web` akan secara otomatis mem-proxy `/api` ke Backend NestJS dan `/wilayah-logo` ke Storage MinIO.

---

## 🚀 Langkah 4: Klik Deploy!

1. Klik tombol **Deploy** di Dokploy.
2. Dokploy secara otomatis akan:
   - Mengunduh kodingan dari GitHub.
   - Menjalankan PostgreSQL 16 (`db`) dan MinIO Storage (`minio`).
   - Menjalankan script `minio_setup` untuk menyalin seluruh file logo provinsi & kabupaten ke MinIO.
   - Mengisi otomatis data 90.823 Boundaries geospasial & data wilayah ke PostgreSQL.
   - Membangun Backend NestJS API (`api`) dan Frontend React UI (`web`).

---

## ✅ Verifikasi Setelah Deploy:
- **Aplikasi Web & Map Explorer**: `https://wilayah.domainanda.com` (atau `http://IP_VPS_ANDA`)
- **API Swagger Documentation**: `https://wilayah.domainanda.com/api/docs` (atau `http://IP_VPS_ANDA:3000/api/docs`)
- **MinIO Web Console**: `http://IP_VPS_ANDA:9001`
