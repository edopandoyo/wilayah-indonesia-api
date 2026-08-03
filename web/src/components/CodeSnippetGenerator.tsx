import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const CodeSnippetGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'axios' | 'python'>('curl');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/provinces/32/regencies');
  const [copied, setCopied] = useState<boolean>(false);

  const getFullUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    return `${origin}${selectedEndpoint}`;
  };

  const getSnippets = () => {
    const url = getFullUrl();
    return {
      curl: `curl -X GET "${url}" \\
  -H "Accept: application/json"`,

      js: `fetch("${url}")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`,

      axios: `import axios from 'axios';

async function getRegencies() {
  try {
    const response = await axios.get("${url}");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching regencies:", error);
  }
}`,

      python: `import requests

url = "${url}"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f"Error: {response.status_code}")`,
    };
  };

  const currentCode = getSnippets()[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-title)' }}>
            Integration Code Snippets
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Salin contoh kode integrasi siap pakai dalam bahasa pemrograman favorit Anda.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Pilih Endpoint:
            </label>
            <select
              className="input-select"
              style={{ maxWidth: '360px', padding: '8px 12px' }}
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
            >
              <option value="/api/provinces">GET /api/provinces (Daftar Provinsi)</option>
              <option value="/api/provinces/32/regencies">GET /api/provinces/32/regencies (Kab/Kota Jawa Barat)</option>
              <option value="/api/wilayah/search?name=Bandung">GET /api/wilayah/search?name=Bandung (Cari Wilayah)</option>
              <option value="/api/islands?limit=10">GET /api/islands (Daftar Pulau)</option>
            </select>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '16px', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '4px' }}>
            {[
              { key: 'curl', label: 'cURL' },
              { key: 'js', label: 'JavaScript (Fetch)' },
              { key: 'axios', label: 'Axios' },
              { key: 'python', label: 'Python (requests)' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === t.key ? '2px solid #3b82f6' : '2px solid transparent',
                  color: activeTab === t.key ? '#3b82f6' : 'var(--text-body)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="code-box">
            <div className="code-header">
              <span>{activeTab.toUpperCase()} Code</span>
              <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre className="code-body" style={{ minHeight: '160px' }}>
              {currentCode}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
