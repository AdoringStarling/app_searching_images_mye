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

// Parse CSV and deduplicate by nombre_archivo (each image appears twice with different standardized names)
function loadCSVData(): ImageMetadata[] {
  const csvPath = path.join(process.cwd(), 'public', 'data', 'inv_img.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvData.trim().split('\n');

  const seen = new Set<string>();
  const data: ImageMetadata[] = [];
  let id = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const nombreArchivo = cleanValue(values[1]) || '';
    if (seen.has(nombreArchivo)) continue;
    seen.add(nombreArchivo);
    id++;
    data.push({
      id: id.toString(),
      ruta_completa: cleanValue(values[0]) || '',
      nombre_archivo: nombreArchivo,
      nombre_unico_completo: cleanValue(values[2]) || '',
      nombre_unico: cleanValue(values[20]) || '',
      escenario: cleanValue(values[5]) || '' as any,
      periodo: cleanValue(values[6]) || '',
      escala: cleanValue(values[7]) || '' as any,
      sector: cleanValue(values[8]) || '',
      sub_sector: cleanValue(values[9]) || '',
      componente: cleanValue(values[10]) || '' as any,
      tipo: cleanValue(values[11]) || '' as any,
      atributo: cleanValue(values[12]) || '',
      diferenciador: cleanValue(values[13]) || undefined,
      tema_principal: cleanValue(values[14]) || '',
      subcarpeta_1: cleanValue(values[15]) || '',
      subcarpeta_2: cleanValue(values[16]) || '',
      subcarpeta_3: cleanValue(values[17]) || '',
      subcarpeta_4: cleanValue(values[18]) || '',
      subcarpeta_5: cleanValue(values[19]) || '',
    });
  }

  return data;
}

function extractUniqueOptions(data: ImageMetadata[], field: keyof ImageMetadata): string[] {
  return data
    .map(item => item[field])
    .filter((value): value is string => value !== undefined && value !== null && typeof value === 'string' && value.trim() !== '')
    .map(value => value === 'NaN' || value === 'nan' || value === 'null' ? 'NO ESPECIFICA' : value)
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort();
}

function buildFilterOptions(data: ImageMetadata[]): FilterOptions {
  return {
    escenarios: extractUniqueOptions(data, 'escenario'),
    periodos: extractUniqueOptions(data, 'periodo'),
    escalas: extractUniqueOptions(data, 'escala'),
    sectores: extractUniqueOptions(data, 'sector'),
    subSectores: extractUniqueOptions(data, 'sub_sector'),
    componentes: extractUniqueOptions(data, 'componente'),
    tipos: extractUniqueOptions(data, 'tipo'),
    atributos: extractUniqueOptions(data, 'atributo'),
  };
}

export function getInitialFilterOptions(): FilterOptions {
  const data = loadCSVData();
  return buildFilterOptions(data);
}

// Nueva función para obtener opciones filtradas basadas en los filtros actuales (lado servidor)
export function getFilteredOptions(currentFilters: Partial<SearchFilters>): FilterOptions {
  const data = loadCSVData();

  const filteredData = data.filter(item => {
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

  return buildFilterOptions(filteredData);
}

export function searchImageData(searchParams: SearchFilters): ImageMetadata[] {
  const data = loadCSVData();

  // Apply filters
  return data.filter(item => {
    // Text search across multiple fields
    if (searchParams.searchText) {
      const searchText = searchParams.searchText.toLowerCase();
      const searchableText = [
        item.nombre_archivo,
        item.nombre_unico_completo,
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