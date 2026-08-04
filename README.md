# Wilayah Indonesia REST API, MinIO Storage, Boundaries GeoJSON & Interactive UI

Solusi REST API Wilayah Indonesia berbasis **NestJS**, **PostgreSQL**, **MinIO Storage**, **Data Geospasial Boundaries (GeoJSON)**, dan **React + Vite Frontend (Leaflet Map)** untuk dokumentasi & pengujian interaktif, berjalan secara fully containerized menggunakan **Docker**.

Data referensi disusun berdasarkan Keputusan Menteri Dalam Negeri (Kepmendagri) terbaru beserta logo resmi Provinsi dan Kabupaten/Kota.

🌐 **Live Demo & Dokumentasi**: [https://wilayah.smartartstudio.my.id](https://wilayah.smartartstudio.my.id)  
📦 **Sumber Data**: [cahyadsn/wilayah](https://github.com/cahyadsn/wilayah)

---

## 🚀 Fitur Utama

- **Layanan REST API (NestJS + TypeORM + PostgreSQL)**:
  - `GET /api/provinces` (Daftar provinsi + `logo_url`)
  - `GET /api/regencies` (Daftar kabupaten/kota + `logo_url`)
  - `GET /api/districts` (Daftar kecamatan)
  - `GET /api/villages` (Daftar kelurahan/desa)
  - `GET /api/kodepos/:code` (Data Kode Pos 5-digit berdasarkan kode desa/kelurahan)
  - `GET /api/kodepos/search?kodepos=...` (Pencarian wilayah & desa berdasarkan 5-digit kode pos)
  - `GET /api/boundaries/:code` (Data geospasial coordinates & polygon GeoJSON path)
  - `GET /api/boundaries/:code/children` (Data geospasial seluruh sub-wilayah)
  - `GET /api/wilayah/search?name=...` (Pencarian wilayah realtime + logo & kodepos)
  - `GET /api/wilayah/:code` (Detail wilayah + coordinates, boundary, logo_url, kodepos, penduduk, & luas)
  - `GET /api/islands` (Data pulau Indonesia beserta koordinat)
  - **Swagger OpenAPI Documentation** di `/api/docs`.

- **Data Kode Pos (83.762 Data Desa/Kelurahan)**:
  - Pemetaan lengkap 5-digit Kode Pos untuk seluruh Desa/Kelurahan di Indonesia.

- **Data Geospasial Boundaries (90.823 Data)**:
  - Memuat data koordinat *centroid* (`lat`, `lng`) dan *polygon array* GeoJSON (`path`) mencakup Provinsi, Kabupaten/Kota, Kecamatan, hingga Kelurahan/Desa.

- **MinIO Object Storage & Auto Logo Sync**:
  - Menyimpan secara otomatis seluruh gambar logo resmi Provinsi & Kabupaten/Kota dari folder `wilayah_logo`.
  - Akses publik via `http://localhost/wilayah-logo/{kode}.png`.
  - **Dynamic Link Env**: Menggunakan environment variable `MINIO_PUBLIC_URL` sehingga dapat diatur secara dinamis untuk environment *Development*, *Production*, maupun *Dokploy VPS*.

- **Web Frontend Documentation & Interactive Map (React + Vite)**:
  - **Interactive Cascading Explorer**: Uji coba alur hirarki dari *Provinsi -> Kabupaten/Kota -> Kecamatan -> Kelurahan/Desa* lengkap dengan pratinjau gambar logo dari MinIO & Kode Pos.
  - **Peta Interaktif Leaflet**: Visualisasi otomatis *Polygon Boundary* dan *Centroid Marker Popup* (Logo MinIO) sesuai wilayah yang dipilih.
  - **Live Endpoint Tester**: Pengujian endpoint secara langsung dari browser.
  - **Code Generator Snippets**: Contoh integrasi kode siap pakai (cURL, JavaScript, Axios, Python).

---

## 📦 Sumber Data

Data wilayah administrasi pemerintahan, kode pos, batas wilayah geospasial, dan kode referensi pada proyek ini bersumber dari repositori open-source:
- **[cahyadsn/wilayah](https://github.com/cahyadsn/wilayah)** (Database Wilayah Administrative Indonesia & Polygon GeoJSON).
- **[cahyadsn/wilayah_kodepos](https://github.com/cahyadsn/wilayah_kodepos)** (Mapping 83.762 Kode Pos vs Kode Wilayah Indonesia Kepmendagri terbaru).

---

## ⚙️ Konfigurasi Environment Variable (`.env`)

Seluruh konfigurasi dapat diatur secara dinamis melalui file `.env`. Gunakan template [.env.example](file:///c:/projects/wilayah-indonesia/.env.example):

```env
# Database Configuration (PostgreSQL)
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=wilayah_db

# MinIO Object Storage
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_BUCKET_NAME=wilayah-logo

# URL Publik Logo MinIO (Ubah ke IP VPS / Domain Dokploy Anda saat deploy)
MINIO_PUBLIC_URL=http://localhost/wilayah-logo

# NestJS API Port
PORT=3000
```

---

## 🛠️ Cara Menjalankan Lokal dengan Docker

Cukup jalankan satu perintah berikut di root repositori:

```bash
docker compose up --build -d
```

Service yang berjalan:
1. **Database PostgreSQL**: `localhost:5432` (Auto-seed data)
2. **MinIO Storage Console**: `http://localhost:9001` (User: `minioadmin` / Pass: `minioadmin`)
3. **MinIO Logo API / Proxy**: `http://localhost/wilayah-logo/{kode}.png`
4. **NestJS REST API**: `http://localhost:3000` (Swagger UI: `http://localhost:3000/api/docs`)
5. **React + Vite Frontend (Nginx)**: `http://localhost`

---

## ☁️ Deployment ke GitHub & Dokploy VPS

Untuk petunjuk lengkap cara push ke GitHub dan deploy 1-click menggunakan **Dokploy VPS**, silakan buka file panduan khusus:
👉 **[DOKPLOY_DEPLOYMENT.md](file:///c:/projects/wilayah-indonesia/DOKPLOY_DEPLOYMENT.md)**

---

## 📋 Change Log

### 🔖 Release `v1.1.0` [2026-08-04]
- **Integrasi Data Kode Pos (83.762 Data)**:
  - Penambahan tabel & data `wilayah_kodepos` bersumber dari [cahyadsn/wilayah_kodepos](https://github.com/cahyadsn/wilayah_kodepos).
  - Penambahan endpoint REST API `/api/kodepos/:code` dan `/api/kodepos/search`.
  - Integrasi atribut `kodepos` pada endpoint detail `/api/wilayah/:code` & pencarian `/api/wilayah/search`.
- **Tampilan Peta Geospasial & Web UI**:
  - Penambahan penanda/badge `📮 Kode Pos` pada Header Peta & Popup Centroid Marker Leaflet Map.
  - Penambahan dokumentasi & Live Tester Kode Pos pada Web UI Explorer.

### 🔖 Release `v1.0.0` [2026-08-03]
- **REST API Wilayah & Geospasial**: Peluncuran awal REST API NestJS & PostgreSQL untuk data 38 Provinsi, 514 Kab/Kota, 7.277 Kecamatan, 83.771 Desa/Kelurahan, dan Pulau.
- **Boundaries GeoJSON**: Integrasi 90.823 polygon geospasial & koordinat centroid.
- **MinIO Logo Storage**: Sinkronisasi otomatis logo wilayah ke MinIO Object Storage.
- **Interactive UI**: Web explorer & peta interaktif Leaflet (React + Vite).
- **Live Demo & Docs**: Deployment dan publikasi dokumentasi di [wilayah.smartartstudio.my.id](https://wilayah.smartartstudio.my.id).
- **SEO & AI Discovery**: Penambahan SEO Meta Tags, JSON-LD Structured Data, dan manifest `llms.txt`.
- **Deployment**: Dukungan Docker Compose & Dokploy VPS.



