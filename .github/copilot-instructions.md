# SIAVRA-MME Image Search Tool - Next.js Project

This is a specialized Next.js application for searching territorial analysis images from the SIAVRA-MME project. The application provides advanced filtering capabilities for climate and territorial analysis imagery.

## Project Context
- **Project**: SIAVRA-MME (Sistema de Análisis de Vulnerabilidad y Riesgo Adaptativo - Ministerio de Minas y Energía)
- **Purpose**: Image search tool for territorial climate analysis
- **Data**: 1,064+ territorial analysis images with metadata
- **Technology**: Next.js with TypeScript

## Key Features
- Advanced filtering system with dropdown selectors
- Dynamic filter options based on data
- Responsive design with modern UI
- CSV data integration and processing
- SIAVRA-MME branding and visual identity

## Filter Categories
- ESCENARIO: REFERENCIA, SSP245, SSP370
- PERIODO: Date ranges (1990-2021, 2041-2060, 2081-2100, etc.)
- ESCALA: Territorial, Sectorial
- SECTOR: Hidrocarburos, Minería, Energía
- SUB_SECTOR: Producción, Transporte, Exploración, Generación
- COMPONENTE: Biotico, Habitat_Humano, Infraestructura, Salud_humana
- TIPO: AMENAZA, VULNERABILIDAD, CAPACIDAD_ADAPTATIVA, SENSIBILIDAD, RIESGO, INDICADOR, DELTA
- ATRIBUTO: Specific attributes (display "NO ESPECIFICA" for null/NaN values)

## Development Guidelines
- Use TypeScript for type safety
- Implement responsive design patterns
- Handle CSV data processing efficiently
- Replace null/NaN attribute values with "NO ESPECIFICA"
- Follow Next.js best practices
- Implement proper error handling
- Use modern React patterns (hooks, functional components)

## Visual Identity
- Apply SIAVRA-MME branding consistently
- Use provided logo and visual identity manual
- Maintain professional government project appearance
- Ensure accessibility compliance