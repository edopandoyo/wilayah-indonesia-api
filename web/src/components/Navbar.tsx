import React from 'react';
import { MapPin, BookOpen, ExternalLink, Code2, Bot } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav 
      aria-label="Navigasi Utama Wilayah Indonesia API" 
      style={{ borderBottom: '1px solid var(--border)', background: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <MapPin size={22} color="#ffffff" />
          </div>
          <div>
            <a href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-title)', letterSpacing: '-0.5px' }}>
                Wilayah <span style={{ color: '#3b82f6' }}>ID</span> API
              </span>
            </a>
            <span className="badge badge-level" style={{ marginLeft: '10px' }}>v1.0.0</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="#playground" id="nav-explorer-link" data-testid="nav-explorer" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Code2 size={16} /> Explorer & Peta
          </a>
          <a href="#docs" id="nav-docs-link" data-testid="nav-docs" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <BookOpen size={16} /> Dokumentasi
          </a>
          <a href="/llms.txt" target="_blank" rel="noreferrer" id="nav-llms-link" data-testid="nav-llm-spec" className="btn btn-secondary" style={{ fontSize: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981' }} title="Spesifikasi Machine Readable untuk AI Agent / LLM">
            <Bot size={16} /> llms.txt
          </a>
          <a href="/api/docs" target="_blank" rel="noreferrer" id="nav-swagger-link" data-testid="nav-swagger" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            Swagger UI <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </nav>
  );
};
