import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, RefreshCw, Image } from 'lucide-react';
import { WilayahMap } from './WilayahMap';

interface WilayahItem {
  kode: string;
  nama: string;
  logo_url?: string;
}

interface MapData {
  code?: string;
  name?: string;
  level?: string;
  lat?: number | null;
  lng?: number | null;
  path?: any;
  logoUrl?: string | null;
  kodepos?: string | null;
}

export const InteractiveExplorer: React.FC = () => {
  const [provinces, setProvinces] = useState<WilayahItem[]>([]);
  const [regencies, setRegencies] = useState<WilayahItem[]>([]);
  const [districts, setDistricts] = useState<WilayahItem[]>([]);
  const [villages, setVillages] = useState<WilayahItem[]>([]);

  const [selectedProv, setSelectedProv] = useState<string>('');
  const [selectedReg, setSelectedReg] = useState<string>('');
  const [selectedDist, setSelectedDist] = useState<string>('');
  const [selectedVill, setSelectedVill] = useState<string>('');

  const [activeUrl, setActiveUrl] = useState<string>('/api/provinces');
  const [jsonResponse, setJsonResponse] = useState<string>('{\n  "message": "Pilih provinsi untuk menguji API live"\n}');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const [mapData, setMapData] = useState<MapData>({});

  const getApiBase = () => {
    return window.location.port === '5173' ? 'http://localhost:3000' : '';
  };

  const fetchEndpoint = async (url: string) => {
    setLoading(true);
    setActiveUrl(url);
    const start = performance.now();
    try {
      const fullUrl = `${getApiBase()}${url}`;
      const res = await fetch(fullUrl);
      const end = performance.now();
      setResponseTime(Math.round(end - start));
      setStatus(res.status);
      const data = await res.json();
      setJsonResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setStatus(500);
      setJsonResponse(JSON.stringify({ error: 'Gagal terhubung ke API', detail: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // Fetch Provinces on mount
  useEffect(() => {
    fetchEndpoint('/api/provinces').then(() => {
      fetch(`${getApiBase()}/api/provinces`)
        .then(r => r.json())
        .then(d => Array.isArray(d) && setProvinces(d))
        .catch(() => {});
    });
  }, []);

  const currentCode = selectedVill || selectedDist || selectedReg || selectedProv;

  // Fetch detail & map info whenever selected region changes
  useEffect(() => {
    if (!currentCode) {
      setMapData({});
      return;
    }

    fetch(`${getApiBase()}/api/wilayah/${currentCode}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.kode) {
          setMapData({
            code: d.kode,
            name: d.nama,
            level: d.level,
            lat: d.coordinates?.lat ?? null,
            lng: d.coordinates?.lng ?? null,
            path: d.boundary ?? null,
            logoUrl: d.logo_url ?? null,
            kodepos: d.kodepos ?? null,
          });
        }
      })
      .catch(() => {});
  }, [currentCode]);

  // Handle Province change
  const handleProvChange = (code: string) => {
    setSelectedProv(code);
    setSelectedReg('');
    setSelectedDist('');
    setSelectedVill('');
    setRegencies([]);
    setDistricts([]);
    setVillages([]);

    if (code) {
      const url = `/api/provinces/${code}/regencies`;
      fetchEndpoint(url);
      fetch(`${getApiBase()}${url}`)
        .then(r => r.json())
        .then(d => Array.isArray(d) && setRegencies(d))
        .catch(() => {});
    } else {
      fetchEndpoint('/api/provinces');
    }
  };

  // Handle Regency change
  const handleRegChange = (code: string) => {
    setSelectedReg(code);
    setSelectedDist('');
    setSelectedVill('');
    setDistricts([]);
    setVillages([]);

    if (code) {
      const url = `/api/regencies/${code}/districts`;
      fetchEndpoint(url);
      fetch(`${getApiBase()}${url}`)
        .then(r => r.json())
        .then(d => Array.isArray(d) && setDistricts(d))
        .catch(() => {});
    } else if (selectedProv) {
      fetchEndpoint(`/api/provinces/${selectedProv}/regencies`);
    }
  };

  // Handle District change
  const handleDistChange = (code: string) => {
    setSelectedDist(code);
    setSelectedVill('');
    setVillages([]);

    if (code) {
      const url = `/api/districts/${code}/villages`;
      fetchEndpoint(url);
      fetch(`${getApiBase()}${url}`)
        .then(r => r.json())
        .then(d => Array.isArray(d) && setVillages(d))
        .catch(() => {});
    } else if (selectedReg) {
      fetchEndpoint(`/api/regencies/${selectedReg}/districts`);
    }
  };

  // Handle Village change
  const handleVillChange = (code: string) => {
    setSelectedVill(code);
    if (code) {
      fetchEndpoint(`/api/villages/${code}`);
    } else if (selectedDist) {
      fetchEndpoint(`/api/districts/${selectedDist}/villages`);
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeLogoCode = selectedReg || selectedProv;
  const activeLogoName = regencies.find(r => r.kode === selectedReg)?.nama || provinces.find(p => p.kode === selectedProv)?.nama;

  return (
    <section id="playground" style={{ padding: '40px 0 60px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-title)' }}>
            Interactive Cascading Explorer & Peta Geospasial
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Uji coba langsung alur hirarki wilayah dari Provinsi hingga Desa, visualisasi peta geospasial, polygon boundaries, dan logo MinIO.
          </p>
        </div>

        <div className="explorer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Controls Form */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-title)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={18} color="#3b82f6" /> Select Level Region
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="prov-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  1. Provinsi (Level 1)
                </label>
                <select 
                  id="prov-select"
                  aria-label="Pilih Provinsi"
                  className="input-select"
                  value={selectedProv}
                  onChange={(e) => handleProvChange(e.target.value)}
                >
                  <option value="">-- Pilih Provinsi --</option>
                  {provinces.map((p) => (
                    <option key={p.kode} value={p.kode}>{p.kode} - {p.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="reg-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  2. Kabupaten / Kota (Level 2)
                </label>
                <select 
                  id="reg-select"
                  aria-label="Pilih Kabupaten atau Kota"
                  className="input-select"
                  value={selectedReg}
                  disabled={!selectedProv}
                  onChange={(e) => handleRegChange(e.target.value)}
                >
                  <option value="">-- Pilih Kabupaten / Kota --</option>
                  {regencies.map((r) => (
                    <option key={r.kode} value={r.kode}>{r.kode} - {r.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dist-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  3. Kecamatan (Level 3)
                </label>
                <select 
                  id="dist-select"
                  aria-label="Pilih Kecamatan"
                  className="input-select"
                  value={selectedDist}
                  disabled={!selectedReg}
                  onChange={(e) => handleDistChange(e.target.value)}
                >
                  <option value="">-- Pilih Kecamatan --</option>
                  {districts.map((d) => (
                    <option key={d.kode} value={d.kode}>{d.kode} - {d.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="vill-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  4. Kelurahan / Desa (Level 4)
                </label>
                <select 
                  id="vill-select"
                  aria-label="Pilih Desa atau Kelurahan"
                  className="input-select"
                  value={selectedVill}
                  disabled={!selectedDist}
                  onChange={(e) => handleVillChange(e.target.value)}
                >
                  <option value="">-- Pilih Desa / Kelurahan --</option>
                  {villages.map((v) => (
                    <option key={v.kode} value={v.kode}>{v.kode} - {v.nama}</option>
                  ))}
                </select>
              </div>

              {/* Logo Preview Card */}
              {activeLogoCode && (
                <div style={{ marginTop: '8px', padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img 
                    src={`/wilayah-logo/${activeLogoCode}.png`} 
                    alt="Logo Wilayah"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    style={{ width: '48px', height: '48px', objectFit: 'contain', flexShrink: 0 }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Image size={12} color="#10b981" /> Logo MinIO Storage
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-title)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activeLogoName}
                    </div>
                    <a 
                      href={`/wilayah-logo/${activeLogoCode}.png`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'none' }}
                    >
                      Buka di MinIO ({activeLogoCode}.png) ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Response Viewer */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-get">GET</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600, wordBreak: 'break-all' }}>
                  {activeUrl}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {status && (
                  <span className="badge" style={{ background: status === 200 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: status === 200 ? '#10b981' : '#ef4444' }}>
                    {status} OK
                  </span>
                )}
                {responseTime && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {responseTime} ms
                  </span>
                )}
                <button onClick={() => fetchEndpoint(activeUrl)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Reload">
                  <RefreshCw size={14} className={loading ? 'spin' : ''} />
                </button>
              </div>
            </div>

            <div className="code-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="code-header">
                <span>Response Body (JSON)</span>
                <button onClick={copyJson} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="code-body" style={{ flex: 1, minHeight: '260px' }}>
                {jsonResponse}
              </pre>
            </div>
          </div>
        </div>

        {/* Interactive Map Component */}
        <div style={{ marginTop: '24px' }}>
          <WilayahMap
            code={mapData.code}
            name={mapData.name}
            level={mapData.level}
            lat={mapData.lat}
            lng={mapData.lng}
            path={mapData.path}
            logoUrl={mapData.logoUrl}
            kodepos={mapData.kodepos}
          />
        </div>
      </div>
    </section>
  );
};
