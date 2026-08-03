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
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 800, color: 'var(--text-title)' }}>
            Dokumentasi REST API Endpoints
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Referensi lengkap seluruh REST API endpoint Wilayah Indonesia beserta parameter pendukung.
          </p>
        </div>

        {/* Mobile Dropdown Selector */}
        <div className="mobile-endpoint-selector" style={{ display: 'none', marginBottom: '20px' }}>
          <label htmlFor="mobile-endpoint-select" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>
            Pilih Endpoint API:
          </label>
          <select
            id="mobile-endpoint-select"
            aria-label="Pilih Endpoint API"
            className="input-select"
            value={selectedEndpoint.path}
            onChange={(e) => {
              const ep = endpoints.find((item) => item.path === e.target.value);
              if (ep) handleSelectEndpoint(ep);
            }}
          >
            {endpoints.map((ep, idx) => (
              <option key={idx} value={ep.path}>
                GET {ep.path} - {ep.summary}
              </option>
            ))}
          </select>
        </div>

        <div className="docs-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '20px' }}>
          {/* Left Navigation (Desktop Sidebar) */}
          <div className="glass-card desktop-docs-sidebar" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '550px', overflowY: 'auto' }}>
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
                <span className="badge badge-get" style={{ fontSize: '0.65rem', flexShrink: 0 }}>GET</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ep.path}
                </span>
              </button>
            ))}
          </div>

          {/* Main Detail View */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span className="badge badge-get" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>GET</span>
              <h3 style={{ fontSize: 'clamp(1.05rem, 3.5vw, 1.3rem)', fontWeight: 700, color: 'var(--text-title)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {selectedEndpoint.path}
              </h3>
            </div>

            <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '8px', fontWeight: 700 }}>
              {selectedEndpoint.summary}
            </h4>
            <p style={{ color: 'var(--text-body)', marginBottom: '24px', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {selectedEndpoint.description}
            </p>

            {/* Parameters Table & Mobile Cards */}
            {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
              <div style={{ marginBottom: '24px', width: '100%', minWidth: 0 }}>
                <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  Parameters
                </h5>

                {/* Desktop Table View */}
                <div className="param-desktop-table" style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '450px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-title)', background: 'rgba(255,255,255,0.02)' }}>
                        <th style={{ padding: '10px 12px' }}>Nama</th>
                        <th style={{ padding: '10px 12px' }}>Tipe</th>
                        <th style={{ padding: '10px 12px' }}>Wajib</th>
                        <th style={{ padding: '10px 12px' }}>Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEndpoint.params.map((p, pIdx) => (
                        <tr key={pIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#60a5fa', fontWeight: 600 }}>{p.name}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{p.type}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ color: p.required ? '#ef4444' : 'var(--text-muted)', fontWeight: 600 }}>
                              {p.required ? 'Ya' : 'Opsional'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-body)' }}>{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View */}
                <div className="param-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  {selectedEndpoint.params.map((p, pIdx) => (
                    <div key={pIdx} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontFamily: 'monospace', color: '#60a5fa', fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                            {p.type}
                          </span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: p.required ? '#ef4444' : '#10b981', background: p.required ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${p.required ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}` }}>
                            {p.required ? 'Wajib' : 'Opsional'}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', margin: 0, lineHeight: 1.5 }}>
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Endpoint Tester */}
            <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input 
                  id="api-test-input"
                  aria-label="URL Endpoint Test"
                  type="text" 
                  className="input-select" 
                  value={testUrl} 
                  onChange={(e) => setTestUrl(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem', flex: 1, minWidth: '200px' }}
                />
                <button onClick={executeTest} disabled={loading} className="btn btn-primary" style={{ whiteSpace: 'nowrap', minWidth: '120px', justifyContent: 'center' }}>
                  <Send size={15} className={loading ? 'spin' : ''} /> {loading ? 'Testing...' : 'Test Live'}
                </button>
              </div>

              {testResult && (
                <div className="code-box">
                  <div className="code-header">
                    <span>Response Preview</span>
                  </div>
                  <pre className="code-body" style={{ maxHeight: '250px' }}>
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
