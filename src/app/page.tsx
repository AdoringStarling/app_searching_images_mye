'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FilterOptions } from '@/types';
import { loadFilterOptions } from '@/lib/data-utils';
import ImageSearch from '@/components/ImageSearch';

export default function Home() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    escenarios: [],
    periodos: [],
    escalas: [],
    sectores: [],
    subSectores: [],
    componentes: [],
    tipos: [],
    atributos: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const options = await loadFilterOptions();
        setFilterOptions(options);
        setError(null);
      } catch (err) {
        console.error('Failed to load filter options:', err);
        setError('Failed to load filter options. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando opciones de filtros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/logos/Escudo_unal_2016.png"
                alt="Universidad Nacional de Colombia"
                width={60}
                height={60}
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SIAVRA - MME</h1>
                <p className="text-sm text-gray-600">Sistema de Información Climática del MME</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Ministerio de Minas y Energía</p>
              <p className="text-xs text-gray-400">Sistema de Información Climática del MME</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ImageSearch filterOptions={filterOptions} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2026 Universidad Nacional de Colombia - Ministerio de Minas y Energía</p>
            <p>Sistema de Información Climática del MME</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
