-- Schema Initialization for PostgreSQL Wilayah Indonesia Database

CREATE TABLE IF NOT EXISTS wilayah (
    kode VARCHAR(13) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL
);
CREATE INDEX IF NOT EXISTS wilayah_nama_idx ON wilayah (nama);

CREATE TABLE IF NOT EXISTS wilayah_pulau (
    kode VARCHAR(15) PRIMARY KEY,
    nama VARCHAR(255),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    status VARCHAR(50),
    luas DOUBLE PRECISION,
    notes TEXT
);
CREATE INDEX IF NOT EXISTS pulau_nama_idx ON wilayah_pulau(nama);

CREATE TABLE IF NOT EXISTS wilayah_penduduk (
    kode VARCHAR(13) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    pria INT NOT NULL DEFAULT 0,
    wanita INT NOT NULL DEFAULT 0,
    total INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS penduduk_nama_idx ON wilayah_penduduk(nama);

CREATE TABLE IF NOT EXISTS wilayah_luas (
    kode VARCHAR(13) PRIMARY KEY,
    nama VARCHAR(100),
    luas DOUBLE PRECISION NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS luas_nama_idx ON wilayah_luas(nama);

CREATE TABLE IF NOT EXISTS wilayah_boundaries (
    kode VARCHAR(13) PRIMARY KEY,
    nama VARCHAR(100),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    path TEXT,
    status INT2 DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_wilayah_coords_pg ON wilayah_boundaries (lat, lng);

CREATE TABLE IF NOT EXISTS wilayah_kodepos (
    kode VARCHAR(13) PRIMARY KEY,
    kodepos VARCHAR(5) DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS kodepos_idx ON wilayah_kodepos (kodepos);


