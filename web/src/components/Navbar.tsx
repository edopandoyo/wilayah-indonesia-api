import React, { useState } from 'react';
import { MapPin, BookOpen, ExternalLink, Code2, Bot, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav 
      aria-label="Navigasi Utama Wilayah Indonesia API" 
      style={{ borderBottom: '1px solid var(--border)', background: 'rgba(11, 15, 25, 0.9)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100 }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <MapPin size={20} color="#ffffff" />
          </div>
          <div>
            <a href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-title)', letterSpacing: '-0.5px' }}>
                Wilayah <span style={{ color: '#3b82f6' }}>ID</span> API
              </span>
            </a>
            <span className="badge badge-level hide-mobile" style={{ marginLeft: '8px' }}>v1.0.0</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

        {/* Mobile Toggle Button */}
        <button 
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px',
            color: 'var(--text-title)',
            cursor: 'pointer',
            display: 'none',
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-container"
          style={{
            background: 'var(--bg-main)',
            borderBottom: '1px solid var(--border)',
            padding: '16px 24px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <a 
            href="#playground" 
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Code2 size={16} /> Explorer & Peta Geospasial
          </a>
          <a 
            href="#docs" 
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <BookOpen size={16} /> Dokumentasi API
          </a>
          <a 
            href="/llms.txt" 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981' }}
          >
            <Bot size={16} /> AI Spec (llms.txt)
          </a>
          <a 
            href="/api/docs" 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Swagger UI OpenAPI <ExternalLink size={14} />
          </a>
        </div>
      )}
    </nav>
  );
};
