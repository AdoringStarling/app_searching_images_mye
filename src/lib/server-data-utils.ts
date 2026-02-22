import { ImageMetadata, FilterOptions, SearchFilters } from '@/types';
import fs from 'fs';
import path from 'path';

// Clean and normalize CSV values
function cleanValue(value: string): string {
  if (!value) return '';
  return value.trim().replace(/^"/, '').replace(/"$/, '');
}

// Handle CSV line parsing with comma-separated values
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

export function getInitialFilterOptions(): FilterOptions {
  const csvPath = path.join(process.cwd(), 'public', 'data', 'inventario_imagenes.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data: ImageMetadata[] = lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    return {
      id: (index + 1).toString(),
      ruta_completa: cleanValue(values[0]) || '',
      tema_principal: cleanValue(values[1]) || '',
      subcarpeta_1: cleanValue(values[2]) || '',
      subcarpeta_2: cleanValue(values[3]) || '',
      subcarpeta_3: cleanValue(values[4]) || '',
      subcarpeta_4: cleanValue(values[5]) || '',
      subcarpeta_5: cleanValue(values[6]) || '',
      nombre_archivo: cleanValue(values[7]) || '',
      escenario: cleanValue(values[8]) || '' as any,
      periodo: cleanValue(values[9]) || '',
      escala: cleanValue(values[10]) || '' as any,
      sector: cleanValue(values[11]) || '',
      sub_sector: cleanValue(values[12]) || '',
      componente: cleanValue(values[13]) || '' as any,
      tipo: cleanValue(values[14]) || '' as any,
      atributo: cleanValue(values[15]) || '',
      diferenciador: cleanValue(values[16]) || undefined,
    };
  });

  // Extraer opciones únicas de cada campo
  const extractUniqueOptions = (field: keyof ImageMetadata): string[] => {
    const options = data
      .map(item => item[field])
      .filter((value): value is string => value !== undefined && value !== null && typeof value === 'string' && value.trim() !== '')
      .map(value => value === 'NaN' || value === 'nan' || value === 'null' ? 'NO ESPECIFICA' : value)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort();
    return options;
  };

  return {
    escenarios: extractUniqueOptions('escenario'),
    periodos: extractUniqueOptions('periodo'),
    escalas: extractUniqueOptions('escala'),
    sectores: extractUniqueOptions('sector'),
    subSectores: extractUniqueOptions('sub_sector'),
    componentes: extractUniqueOptions('componente'),
    tipos: extractUniqueOptions('tipo'),
    atributos: extractUniqueOptions('atributo'),
  };
}

// Nueva función para obtener opciones filtradas basadas en los filtros actuales (lado servidor)
export function getFilteredOptions(currentFilters: Partial<SearchFilters>): FilterOptions {
  const csvPath = path.join(process.cwd(), 'public', 'data', 'inventario_imagenes.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvData.trim().split('\n');
  
  const data: ImageMetadata[] = lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    return {
      id: (index + 1).toString(),
      ruta_completa: cleanValue(values[0]) || '',
      tema_principal: cleanValue(values[1]) || '',
      subcarpeta_1: cleanValue(values[2]) || '',
      subcarpeta_2: cleanValue(values[3]) || '',
      subcarpeta_3: cleanValue(values[4]) || '',
      subcarpeta_4: cleanValue(values[5]) || '',
      subcarpeta_5: cleanValue(values[6]) || '',
      nombre_archivo: cleanValue(values[7]) || '',
      escenario: cleanValue(values[8]) || '' as any,
      periodo: cleanValue(values[9]) || '',
      escala: cleanValue(values[10]) || '' as any,
      sector: cleanValue(values[11]) || '',
      sub_sector: cleanValue(values[12]) || '',
      componente: cleanValue(values[13]) || '' as any,
      tipo: cleanValue(values[14]) || '' as any,
      atributo: cleanValue(values[15]) || '',
      diferenciador: cleanValue(values[16]) || undefined,
    };
  });

  // Filtrar los datos basándose en los filtros actuales
  let filteredData = data.filter(item => {
    return (
      (!currentFilters.escenario || item.escenario === currentFilters.escenario) &&
      (!currentFilters.periodo || item.periodo === currentFilters.periodo) &&
      (!currentFilters.escala || item.escala === currentFilters.escala) &&
      (!currentFilters.sector || item.sector === currentFilters.sector) &&
      (!currentFilters.sub_sector || item.sub_sector === currentFilters.sub_sector) &&
      (!currentFilters.componente || item.componente === currentFilters.componente) &&
      (!currentFilters.tipo || item.tipo === currentFilters.tipo) &&
      (!currentFilters.atributo || 
        (currentFilters.atributo === 'NO ESPECIFICA' ? 
          (!item.atributo || item.atributo === 'NaN' || item.atributo === 'nan' || item.atributo === 'null') : 
          item.atributo === currentFilters.atributo))
    );
  });

  // Extraer opciones únicas de los datos filtrados
  const extractUniqueOptions = (field: keyof ImageMetadata): string[] => {
    const options = filteredData
      .map(item => item[field])
      .filter((value): value is string => value !== undefined && value !== null && typeof value === 'string' && value.trim() !== '')
      .map(value => value === 'NaN' || value === 'nan' || value === 'null' ? 'NO ESPECIFICA' : value)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort();
    return options;
  };

  return {
    escenarios: extractUniqueOptions('escenario'),
    periodos: extractUniqueOptions('periodo'),
    escalas: extractUniqueOptions('escala'),
    sectores: extractUniqueOptions('sector'),
    subSectores: extractUniqueOptions('sub_sector'),
    componentes: extractUniqueOptions('componente'),
    tipos: extractUniqueOptions('tipo'),
    atributos: extractUniqueOptions('atributo'),
  };
}

export function searchImageData(searchParams: SearchFilters): ImageMetadata[] {
  const csvPath = path.join(process.cwd(), 'public', 'data', 'inventario_imagenes.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvData.trim().split('\n');
  
  const data: ImageMetadata[] = lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    return {
      id: (index + 1).toString(),
      ruta_completa: cleanValue(values[0]) || '',
      tema_principal: cleanValue(values[1]) || '',
      subcarpeta_1: cleanValue(values[2]) || '',
      subcarpeta_2: cleanValue(values[3]) || '',
      subcarpeta_3: cleanValue(values[4]) || '',
      subcarpeta_4: cleanValue(values[5]) || '',
      subcarpeta_5: cleanValue(values[6]) || '',
      nombre_archivo: cleanValue(values[7]) || '',
      escenario: cleanValue(values[8]) || '' as any,
      periodo: cleanValue(values[9]) || '',
      escala: cleanValue(values[10]) || '' as any,
      sector: cleanValue(values[11]) || '',
      sub_sector: cleanValue(values[12]) || '',
      componente: cleanValue(values[13]) || '' as any,
      tipo: cleanValue(values[14]) || '' as any,
      atributo: cleanValue(values[15]) || '',
      diferenciador: cleanValue(values[16]) || undefined,
    };
  });

  // Apply filters
  return data.filter(item => {
    // Text search across multiple fields
    if (searchParams.searchText) {
      const searchText = searchParams.searchText.toLowerCase();
      const searchableText = [
        item.nombre_archivo,
        item.componente,
        item.tipo,
        item.atributo,
        item.escenario,
        item.periodo
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchText)) {
        return false;
      }
    }

    // Filter by specific criteria
    if (searchParams.escenario && item.escenario !== searchParams.escenario) return false;
    if (searchParams.periodo && item.periodo !== searchParams.periodo) return false;
    if (searchParams.escala && item.escala !== searchParams.escala) return false;
    if (searchParams.sector && item.sector !== searchParams.sector) return false;
    if (searchParams.sub_sector && item.sub_sector !== searchParams.sub_sector) return false;
    if (searchParams.componente && item.componente !== searchParams.componente) return false;
    if (searchParams.tipo && item.tipo !== searchParams.tipo) return false;
    if (searchParams.atributo && 
        (searchParams.atributo === 'NO ESPECIFICA' ? 
          (item.atributo && item.atributo !== 'NaN' && item.atributo !== 'nan' && item.atributo !== 'null') : 
          item.atributo !== searchParams.atributo)) return false;

    return true;
  });
}