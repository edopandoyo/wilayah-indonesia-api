import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section style={{ padding: '60px 0 40px 0', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="badge badge-level" style={{ marginBottom: '16px', padding: '6px 14px', fontSize: '0.8rem' }}>
          ✨ NestJS + PostgreSQL + Docker Powered REST API
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-title)', lineHeight: 1.15, marginBottom: '20px' }}>
          Dokumentasi & API Wilayah <span className="gradient-text">Administrasi Indonesia</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-body)', marginBottom: '36px', lineHeight: 1.6 }}>
          Layanan REST API performa tinggi berbasis data Kepmendagri terbaru. Dapatkan hirarki wilayah dari Provinsi, Kabupaten/Kota, Kecamatan, hingga Kelurahan/Desa serta data Pulau secara lengkap.
        </p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <div className="glass-card" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6' }}>38</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Provinsi</div>
          </div>
          <div className="glass-card" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>514</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kabupaten / Kota</div>
          </div>
          <div className="glass-card" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>7.200+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kecamatan</div>
          </div>
          <div className="glass-card" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6' }}>83.000+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Desa / Kelurahan</div>
          </div>
          <div className="glass-card" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ec4899' }}>17.000+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pulau</div>
          </div>
        </div>
      </div>
    </section>
  );
};
