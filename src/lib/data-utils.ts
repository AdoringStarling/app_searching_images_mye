import { ImageMetadata, FilterOptions, SearchFilters } from '@/types';

// Load filter options from API
export async function loadFilterOptions(): Promise<FilterOptions> {
  try {
    const response = await fetch('/data/inventario_imagenes.csv');
    if (!response.ok) {
      throw new Error('Failed to load filter options');
    }
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    
    // Parse data to extract filter options
    const data: any[] = [];
    const headers = lines[0].split(',').map(h => h.trim());
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const item: any = {};
      headers.forEach((header, index) => {
        item[header] = cleanValue(values[index]) || '';
      });
      data.push(item);
    }
    
    // Extract unique values for each filter
    const uniqueValues = (field: string): string[] => {
      return [...new Set(data
        .map(item => item[field])
        .filter(value => value && value.trim() !== '')
        .map(value => value === 'NaN' || value === 'nan' || value === 'null' ? 'NO ESPECIFICA' : value)
      )].sort();
    };
    
    return {
      escenarios: uniqueValues('escenario'),
      periodos: uniqueValues('periodo'), 
      escalas: uniqueValues('escala'),
      sectores: uniqueValues('sector'),
      subSectores: uniqueValues('sub_sector'),
      componentes: uniqueValues('componente'),
      tipos: uniqueValues('tipo'),
      atributos: uniqueValues('atributo')
    };
  } catch (error) {
    console.error('Error loading filter options:', error);
    // Return default options as fallback
    return {
      escenarios: ['REFERENCIA', 'SSP245', 'SSP370'],
      periodos: ['1990-2021', '2021-2040', '2041-2060', '2061-2080', '2081-2100'],
      escalas: ['Territorial', 'Sectorial'],
      sectores: ['Hidrocarburos', 'Minería', 'Energía'],
      subSectores: ['Producción', 'Transporte', 'Exploración', 'Generación'],
      componentes: ['Biotico', 'Habitat_Humano', 'Infraestructura', 'Salud_humana'],
      tipos: ['AMENAZA', 'VULNERABILIDAD', 'CAPACIDAD_ADAPTATIVA', 'SENSIBILIDAD', 'RIESGO', 'INDICADOR', 'DELTA'],
      atributos: ['NO ESPECIFICA']
    };
  }
}

// Generate image URL for display
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '/placeholder-image.svg';
  
  // Extract filename from full path
  const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
  if (!fileName) return '/placeholder-image.svg';
  
  return `/images/${fileName}`;
}

// CSV parsing utilities
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

function cleanValue(value: string): string {
  if (!value) return '';
  return value.trim().replace(/^"/, '').replace(/"$/, '');
}