import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Camera className="h-5 w-5 text-primary" />
            <span>PhotoGuide Imóveis</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Termos de Serviço
            </Link>
            <span className="text-slate-400">© 2026 PhotoGuide Imóveis</span>
          </div>
        </div>
      </div>
    </footer>
  );
}