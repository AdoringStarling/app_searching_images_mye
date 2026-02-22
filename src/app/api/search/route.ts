import { searchImageData } from '@/lib/server-data-utils';
import { SearchFilters } from '@/types';

export async function POST(request: Request) {
  try {
    const searchParams: SearchFilters = await request.json();
    const searchResults = searchImageData(searchParams);
    
    return Response.json(searchResults);
  } catch (error) {
    console.error('Error searching images:', error);
    return Response.json(
      { error: 'Failed to search images' }, 
      { status: 500 }
    );
  }
}