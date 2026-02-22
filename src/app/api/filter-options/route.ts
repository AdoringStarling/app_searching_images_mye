import { getFilteredOptions } from '@/lib/server-data-utils';
import { SearchFilters } from '@/types';

export async function POST(request: Request) {
  try {
    const currentFilters: Partial<SearchFilters> = await request.json();
    const filteredOptions = getFilteredOptions(currentFilters);
    
    return Response.json(filteredOptions);
  } catch (error) {
    console.error('Error getting filtered options:', error);
    return Response.json(
      { error: 'Failed to get filtered options' }, 
      { status: 500 }
    );
  }
}