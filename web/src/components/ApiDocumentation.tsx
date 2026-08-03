import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Endpoint {
  method: string;
  path: string;
  summary: string;
  description: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  sampleUrl: string;
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/provinces',
    summary: 'Daftar Semua Provinsi',
    description: 'Mengembalikan daftar seluruh provinsi di Indonesia (38 Provinsi) diurutkan berdasarkan nama.',
    sampleUrl: '/api/provinces',
  },
  {
    method: 'GET',
    path: '/api/provinces/:code',
    summary: 'Detail Provinsi',
    description: 'Mengembalikan detail provinsi berdasarkan kode 2-digit (contoh: `11` untuk Aceh, `32` untuk Jawa Barat).',
    params: [{ name: 'code', type: 'string', required: true, description: 'Kode 2-digit Provinsi' }],
    sampleUrl: '/api/provinces/32',
  },
  {
    method: 'GET',
    path: '/api/provinces/:code/regencies',
    summary: 'Daftar Kabupaten/Kota di Provinsi',
    description: 'Mengembalikan daftar Kabupaten dan Kota yang berada di bawah provinsi tertentu.',
    params: [{ name: 'code', type: 'string', required: true, description: 'Kode 2-digit Provinsi' }],
    sampleUrl: '/api/provinces/32/regencies',
  },
  {
    method: 'GET',
    path: '/api/regencies',
    summary: 'Daftar Kabupaten/Kota',
    description: 'Mengembalikan daftar Kabupaten/Kota dengan opsi filter `province_code`.',
    params: [{ name: 'province_code', type: 'string', required: false, description: 'Filter kode provinsi' }],
    sampleUrl: '/api/regencies?province_code=32',
  },
  {
    method: 'GET',
    path: '/api/regencies/:code/districts',
    summary: 'Daftar Kecamatan di Kab/Kota',
    description: 'Mengembalikan daftar Kecamatan yang berada di bawah Kabupaten/Kota tertentu.',
    params: [{ name: 'code', type: 'string', required: true, description: 'Kode 5-character Kab/Kota (contoh: 32.73)' }],
    sampleUrl: '/api/regencies/32.73/districts',
  },
  {
    method: 'GET',
    path: '/api/districts/:code/villages',
    summary: 'Daftar Kelurahan/Desa di Kecamatan',
    description: 'Mengembalikan daftar Kelurahan dan Desa yang berada di bawah Kecamatan tertentu.',
    params: [{ name: 'code', type: 'string', required: true, description: 'Kode 8-character Kecamatan (contoh: 32.73.01)' }],
    sampleUrl: '/api/districts/32.73.01/villages',
  },
  {
    method: 'GET',
    path: '/api/wilayah/search',
    summary: 'Pencarian Wilayah Realtime',
    description: 'Mencari nama wilayah (Provinsi, Kab/Kota, Kecamatan, atau Desa) dengan filter level & pagination.',
    params: [
      { name: 'name', type: 'string', required: true, description: 'Kata kunci pencarian nama' },
      { name: 'level', type: 'number', required: false, description: 'Filter level: 1 (Prov), 2 (Kab), 3 (Kec), 4 (Desa)' },
      { name: 'page', type: 'number', required: false, description: 'Halaman ke-n' },
      { name: 'limit', type: 'number', required: false, description: 'Item per halaman' },
    ],
    sampleUrl: '/api/wilayah/search?name=Bandung&limit=5',
  },
  {
    method: 'GET',
    path: '/api/wilayah/:code',
    summary: 'Detail Wilayah & Hirarki Full',
    description: 'Mendapatkan informasi wilayah berdasarkan kode lengkap beserta referensi kode induk (parent) & data statistik.',
    params: [{ name: 'code', type: 'string', required: true, description: 'Kode unik wilayah (Provinsi/Kab/Kec/Desa)' }],
    sampleUrl: '/api/wilayah/32.73.01.1001',
  },
  {
    method: 'GET',
    path: '/api/islands',
    summary: 'Daftar Pulau Indonesia',
    description: 'Mengembalikan data pulau-pulau di Indonesia dilengkapi koordinat latitude & longitude.',
    params: [{ name: 'province_code', type: 'string', required: false, description: 'Filter kode provinsi' }],
    sampleUrl: '/api/islands?limit=5',
  },
  {
    method: 'GET',
    path: '/api/boundaries/:code',
    summary: 'Data Geometris Boundaries & Polygon',
    description: 'Mengembalikan data koordinat centroid (lat, lng) serta array polygon coordinates (GeoJSON path) untuk peta wilayah.',
    params: [{ name: 'code', type: 'string', required: true, description: 'Kode unik wilayah (Provinsi, Kab/Kota, Kec, Kel)' }],
    sampleUrl: '/api/boundaries/32.73',
  },
];

export const ApiDocumentation: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpoints[0]);
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [testUrl, setTestUrl] = useState<string>(endpoints[0].sampleUrl);

  const getApiBase = () => {
    return window.location.port === '5173' ? 'http://localhost:3000' : '';
  };

  const handleSelectEndpoint = (ep: Endpoint) => {
    setSelectedEndpoint(ep);
    setTestUrl(ep.sampleUrl);
    setTestResult('');
  };

  const executeTest = async () => {
    setLoading(true);
    try {
      const fullUrl = `${getApiBase()}${testUrl}`;
      const res = await fetch(fullUrl);
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResult(JSON.stringify({ error: 'Failed to execute endpoint test', detail: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="docs" style={{ padding: '40px 0 60px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-title)' }}>
            Dokumentasi REST API Endpoints
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Referensi lengkap seluruh REST API endpoint Wilayah Indonesia beserta parameter pendukung.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
          {/* Left Navigation */}
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '550px', overflowY: 'auto' }}>
            {endpoints.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectEndpoint(ep)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: selectedEndpoint.path === ep.path ? 'var(--primary)' : 'transparent',
                  background: selectedEndpoint.path === ep.path ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  color: selectedEndpoint.path === ep.path ? '#3b82f6' : 'var(--text-body)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition)',
                }}
              >
                <span className="badge badge-get" style={{ fontSize: '0.65rem' }}>GET</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ep.path}
                </span>
              </button>
            ))}
          </div>

          {/* Main Detail View */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span className="badge badge-get" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>GET</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-title)', fontFamily: 'monospace' }}>
                {selectedEndpoint.path}
              </h3>
            </div>

            <h4 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '8px' }}>
              {selectedEndpoint.summary}
            </h4>
            <p style={{ color: 'var(--text-body)', marginBottom: '24px', fontSize: '0.95rem' }}>
              {selectedEndpoint.description}
            </p>

            {/* Parameters Table */}
            {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  Parameters
                </h5>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-title)' }}>
                      <th style={{ padding: '8px 12px' }}>Nama</th>
                      <th style={{ padding: '8px 12px' }}>Tipe</th>
                      <th style={{ padding: '8px 12px' }}>Wajib</th>
                      <th style={{ padding: '8px 12px' }}>Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEndpoint.params.map((p, pIdx) => (
                      <tr key={pIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#60a5fa' }}>{p.name}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{p.type}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{ color: p.required ? '#ef4444' : 'var(--text-muted)' }}>
                            {p.required ? 'Ya' : 'Opsional'}
                          </span>
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-body)' }}>{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Live Endpoint Tester */}
            <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  className="input-select" 
                  value={testUrl} 
                  onChange={(e) => setTestUrl(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                />
                <button onClick={executeTest} disabled={loading} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  <Send size={16} className={loading ? 'spin' : ''} /> {loading ? 'Testing...' : 'Test Live'}
                </button>
              </div>

              {testResult && (
                <div className="code-box">
                  <div className="code-header">
                    <span>Response Preview</span>
                  </div>
                  <pre className="code-body">
                    {testResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
