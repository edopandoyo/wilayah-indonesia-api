import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveExplorer } from './components/InteractiveExplorer';
import { ApiDocumentation } from './components/ApiDocumentation';
import { CodeSnippetGenerator } from './components/CodeSnippetGenerator';

export const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <InteractiveExplorer />
        <ApiDocumentation />
        <CodeSnippetGenerator />
      </main>
      <footer style={{ borderTop: '1px solid var(--border)', padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container">
          <p>© 2026 Wilayah Indonesia API & UI Documentation. Built with NestJS, React, PostgreSQL & Docker.</p>
          <p style={{ marginTop: '8px' }}>
            Data referensi dari Kepmendagri terbaru (cahyadsn/wilayah). Source Code tersedia di{' '}
            <a 
              href="https://github.com/edopandoyo/wilayah-indonesia-api" 
              target="_blank" 
              rel="noreferrer" 
              style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}
            >
              GitHub Repository ↗
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
