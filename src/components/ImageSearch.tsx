'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { ImageMetadata, FilterOptions, SearchFilters } from '@/types';
import FilterDropdown from './FilterDropdown';
import ImageCard from './ImageCard';

interface ImageSearchProps {
  filterOptions: FilterOptions;
}

export default function ImageSearch({ filterOptions }: ImageSearchProps) {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(true);
  const [searchResults, setSearchResults] = useState<ImageMetadata[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentFilterOptions, setCurrentFilterOptions] = useState<FilterOptions>(filterOptions);
  const [isUpdatingFilters, setIsUpdatingFilters] = useState(false);

  // Función para obtener opciones filtradas desde la API
  const getUpdatedFilterOptions = async (currentFilters: Partial<SearchFilters>) => {
    try {
      const response = await fetch('/api/filter-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentFilters),
      });

      if (!response.ok) {
        throw new Error('Failed to get updated filter options');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting updated filter options:', error);
      return filterOptions; // Fallback to original options
    }
  };

  // Cascade order: clearing a filter resets all filters below it
  const filterOrder: (keyof SearchFilters)[] = [
    'escenario', 'periodo', 'escala', 'componente', 'tipo', 'sector', 'sub_sector', 'atributo'
  ];

  const handleFilterChange = async (filterType: keyof SearchFilters, value: string | undefined) => {
    let newFilters = { ...filters, [filterType]: value || undefined };

    // If clearing a filter, also clear all filters below it in the cascade
    if (!value) {
      const idx = filterOrder.indexOf(filterType);
      if (idx !== -1) {
        for (let i = idx + 1; i < filterOrder.length; i++) {
          delete newFilters[filterOrder[i]];
        }
      }
    }
    
    setFilters(newFilters);
    setIsUpdatingFilters(true);
    
    try {
      // Actualizar las opciones de filtros basadas en la nueva selección
      const updatedOptions = await getUpdatedFilterOptions(newFilters);
      setCurrentFilterOptions(updatedOptions);
    } catch (error) {
      console.error('Error updating filter options:', error);
    } finally {
      setIsUpdatingFilters(false);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...filters, searchText }),
      });

      if (!response.ok) {
        throw new Error('Failed to search images');
      }

      const results = await response.json();
      setSearchResults(results);
      setTotalResults(results.length);
      setHasSearched(true);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchText('');
    setSearchResults([]);
    setHasSearched(false);
    setTotalResults(0);
    setCurrentFilterOptions(filterOptions); // Restaurar opciones originales
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchText ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nombre de archivo, componente, tipo, etc..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isSearching ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                Consultando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Consultar
              </>
            )}
          </button>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros avanzados</span>
            {isUpdatingFilters && (
              <div className="animate-spin h-3 w-3 border border-gray-400 rounded-full border-t-transparent"></div>
            )}
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterDropdown
              label="Escenario"
              options={currentFilterOptions.escenarios}
              value={filters.escenario}
              onChange={(value) => handleFilterChange('escenario', value)}
              placeholder="Todos los escenarios"
            />
            
            <FilterDropdown
              label="Período"
              options={currentFilterOptions.periodos}
              value={filters.periodo}
              onChange={(value) => handleFilterChange('periodo', value)}
              placeholder="Todos los períodos"
            />
            
            <FilterDropdown
              label="Escala"
              options={currentFilterOptions.escalas}
              value={filters.escala}
              onChange={(value) => handleFilterChange('escala', value)}
              placeholder="Todas las escalas"
            />
            
            <FilterDropdown
              label="Componente"
              options={currentFilterOptions.componentes}
              value={filters.componente}
              onChange={(value) => handleFilterChange('componente', value)}
              placeholder="Todos los componentes"
            />
            
            <FilterDropdown
              label="Tipo"
              options={currentFilterOptions.tipos}
              value={filters.tipo}
              onChange={(value) => handleFilterChange('tipo', value)}
              placeholder="Todos los tipos"
            />
            
            <FilterDropdown
              label="Sector"
              options={currentFilterOptions.sectores}
              value={filters.sector}
              onChange={(value) => handleFilterChange('sector', value)}
              placeholder="Todos los sectores"
            />
            
            <FilterDropdown
              label="Sub-Sector"
              options={currentFilterOptions.subSectores}
              value={filters.sub_sector}
              onChange={(value) => handleFilterChange('sub_sector', value)}
              placeholder="Todos los sub-sectores"
            />
            
            <FilterDropdown
              label="Atributo"
              options={currentFilterOptions.atributos}
              value={filters.atributo}
              onChange={(value) => handleFilterChange('atributo', value)}
              placeholder="Todos los atributos"
            />
          </div>
        )}
      </div>

      {/* Results Section */}
      {hasSearched && (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Resultados de búsqueda
              </h2>
              <p className="text-sm text-gray-600">
                {totalResults} imagen{totalResults !== 1 ? 'es' : ''} encontrada{totalResults !== 1 ? 's' : ''}
              </p>
            </div>
            
          </div>

          {/* Results List */}
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron imágenes</h3>
              <p className="text-gray-600 mb-4">
                No hay imágenes que coincidan con los filtros seleccionados.
              </p>
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Limpiar filtros y buscar de nuevo
              </button>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">SIAVRA - MME</h3>
          <p className="text-gray-600 mb-6">
            Selecciona filtros y haz clic en "Consultar" para buscar imágenes de análisis territorial.
          </p>
          <div className="text-sm text-gray-500">
            <p>• Usa filtros para refinar tu búsqueda</p>
            <p>• Combina múltiples filtros para resultados específicos</p>
            <p>• El texto de búsqueda funciona en nombres de archivo y metadatos</p>
          </div>
        </div>
      )}
    </div>
  );
}