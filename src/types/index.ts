// Types for SIAVRA - MME

export interface ImageMetadata {
  id: string;
  ruta_completa: string;
  tema_principal: string;
  subcarpeta_1: string;
  subcarpeta_2: string;
  subcarpeta_3: string;
  subcarpeta_4: string;
  subcarpeta_5: string;
  nombre_archivo: string;
  escenario: 'REFERENCIA' | 'SSP245' | 'SSP370';
  periodo: string;
  escala: 'Territorial' | 'Sectorial';
  sector: string;
  sub_sector: string;
  componente: 'Biotico' | 'Habitat_Humano' | 'Infraestructura' | 'Salud_humana';
  tipo: 'AMENAZA' | 'VULNERABILIDAD' | 'CAPACIDAD_ADAPTATIVA' | 'SENSIBILIDAD' | 'RIESGO' | 'INDICADOR' | 'DELTA';
  atributo: string;
  diferenciador?: string;
}

export interface FilterOptions {
  escenarios: string[];
  periodos: string[];
  escalas: string[];
  sectores: string[];
  subSectores: string[];
  componentes: string[];
  tipos: string[];
  atributos: string[];
}

export interface SearchFilters {
  escenario?: 'REFERENCIA' | 'SSP245' | 'SSP370';
  periodo?: string;
  escala?: 'Territorial' | 'Sectorial';
  sector?: string;
  sub_sector?: string;
  componente?: 'Biotico' | 'Habitat_Humano' | 'Infraestructura' | 'Salud_humana';
  tipo?: 'AMENAZA' | 'VULNERABILIDAD' | 'CAPACIDAD_ADAPTATIVA' | 'SENSIBILIDAD' | 'RIESGO' | 'INDICADOR' | 'DELTA';
  atributo?: string;
  searchText?: string;
}

export interface SearchResults {
  images: ImageMetadata[];
  totalCount: number;
  appliedFilters: SearchFilters;
}