# SIAVRA - MME

## Descripción

Herramienta de búsqueda y visualización de imágenes de análisis territorial climático del proyecto **SIAVRA-MME** (Sistema de Análisis de Vulnerabilidad y Riesgo Adaptativo - Ministerio de Minas y Energía). Permite explorar más de 500 imágenes estandarizadas con un sistema de filtros en cascada.

## Requisitos

- **Node.js** versión 18.0 o superior ([descargar](https://nodejs.org))
- **npm** (incluido con Node.js)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## Instalación

### 1. Clonar o descargar el repositorio

```bash
git clone <url-del-repositorio>
cd app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Verificar archivos de datos

Asegurar que existan:

- `public/data/inv_img.csv` — Inventario de imágenes (metadatos)
- `public/imagenes_estandarizadas/` — Carpeta con las imágenes JPG estandarizadas

> Las imágenes deben tener los nombres que aparecen en la columna `nombre_unico_completo` del CSV.

## Ejecución

### Modo desarrollo

```bash
npm run dev
```

Abre la aplicación en **http://localhost:3000**. Se recarga automáticamente al editar el código. Detener con `Ctrl + C`.

### Modo producción

```bash
npm run build
npm start
```

Compila la aplicación optimizada y la sirve en **http://localhost:3000**.

## Uso

1. Abrir `http://localhost:3000` en el navegador.
2. Usar los **filtros en cascada** (escenario, período, escala, etc.) para acotar la búsqueda. Al seleccionar un filtro, los filtros siguientes se ajustan automáticamente mostrando solo las opciones compatibles.
3. Opcionalmente, escribir texto en la barra de búsqueda para filtrar por nombre de archivo o metadatos.
4. Hacer clic en **Consultar** para ver los resultados.
5. Hacer clic en el ícono de ojo para ver la imagen completa con su información detallada.
6. Al limpiar un filtro (X), todos los filtros posteriores en la cascada se reinician.

## Estructura del proyecto

```
├── public/
│   ├── data/
│   │   └── inv_img.csv                    # Inventario de imágenes (metadatos)
│   ├── imagenes_estandarizadas/           # Imágenes JPG estandarizadas (~525)
│   ├── logos/                             # Logos institucionales
│   └── placeholder-image.svg             # Imagen por defecto
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── filter-options/route.ts   # API: opciones de filtros en cascada
│   │   │   └── search/route.ts           # API: búsqueda de imágenes
│   │   ├── layout.tsx                    # Layout raíz (metadata, fuentes)
│   │   ├── page.tsx                      # Página principal
│   │   └── globals.css                   # Estilos globales
│   ├── components/
│   │   ├── FilterDropdown.tsx            # Selector desplegable reutilizable
│   │   ├── ImageCard.tsx                 # Tarjeta de resultado (vista lista)
│   │   ├── ImageModal.tsx                # Modal de detalle de imagen
│   │   └── ImageSearch.tsx               # Componente principal de búsqueda
│   ├── lib/
│   │   ├── data-utils.ts                 # Utilidades cliente (carga de CSV, URL de imagen)
│   │   └── server-data-utils.ts          # Utilidades servidor (lectura CSV con fs, filtrado)
│   └── types/
│       └── index.ts                      # Interfaces TypeScript
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Categorías de filtros

| Filtro | Valores posibles |
|--------|-----------------|
| Escenario | REFERENCIA, SSP245, SSP370 |
| Período | 1990-2021, 2041-2060, 2081-2100, etc. |
| Escala | Territorial, Sectorial |
| Sector | Hidrocarburos, Minería, Energía |
| Sub-Sector | Producción, Transporte, Exploración, Generación |
| Componente | Biotico, Habitat_Humano, Infraestructura, Salud_humana |
| Tipo | AMENAZA, VULNERABILIDAD, RIESGO, SENSIBILIDAD, CAPACIDAD_ADAPTATIVA, INDICADOR, DELTA |
| Atributo | Específico por imagen (o "NO ESPECIFICA") |

## Solución de problemas

| Problema | Solución |
|----------|----------|
| `Cannot find module` | Ejecutar `npm install` de nuevo |
| `Port 3000 already in use` | Usar `npm run dev -- -p 3001` |
| Imágenes no se muestran | Verificar que `public/imagenes_estandarizadas/` contenga los JPG y que los nombres coincidan con `nombre_unico_completo` del CSV |
| Filtros vacíos | Verificar que `public/data/inv_img.csv` exista y tenga el formato correcto (21 columnas) |

## Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Next.js | 16.1.6 | Framework React con App Router y API Routes |
| React | 19.2.3 | Biblioteca de interfaz de usuario |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos utilitarios |
| Lucide React | — | Iconografía |

## Notas técnicas para despliegue y desarrollo

### Arquitectura

La aplicación separa el código en dos capas:

- **Cliente** (`data-utils.ts`): carga el CSV vía `fetch` para obtener las opciones iniciales de filtros. No utiliza módulos de Node.js (`fs`, `path`).
- **Servidor** (`server-data-utils.ts`): lee el CSV con `fs.readFileSync` para las API Routes. Maneja la deduplicación de registros y el filtrado en cascada.

Esta separación es necesaria porque Next.js no permite importar módulos de Node.js en componentes de cliente.

### Datos

El inventario (`inv_img.csv`) tiene 21 columnas. Cada imagen original puede aparecer duplicada en el CSV con diferentes nombres estandarizados; la aplicación deduplica por `nombre_archivo` quedándose con la primera ocurrencia.

### API Routes

- **POST `/api/filter-options`**: recibe los filtros activos y devuelve las opciones válidas restantes (cascada).
- **POST `/api/search`**: recibe filtros + texto de búsqueda y devuelve los registros coincidentes.

### Consideraciones para despliegue en producción

- **Imágenes**: las imágenes se sirven como archivos estáticos desde `public/imagenes_estandarizadas/`. En un entorno de producción con muchas imágenes, considerar un CDN o almacenamiento externo (S3, Azure Blob Storage) y reemplazar la función `getImageUrl()` en `data-utils.ts`.
- **CSV vs Base de datos**: actualmente los datos se leen de un CSV en cada petición. Para mayor escala, migrar a una base de datos (PostgreSQL, SQLite) y reemplazar `loadCSVData()` en `server-data-utils.ts`.
- **Caché**: Next.js cachea las páginas estáticas. Las API Routes son dinámicas; para mejorar rendimiento se puede implementar caché en memoria del CSV parseado.
- **Variables de entorno**: si se migra a almacenamiento externo o base de datos, usar `.env.local` para credenciales (nunca incluir en el repositorio).
- **Plataformas compatibles**: Vercel (despliegue directo), Docker, cualquier servidor Node.js, o exportación estática con `output: 'export'` en `next.config.ts` (requiere reemplazar las API Routes por lógica cliente).

---

**Universidad Nacional de Colombia — Ministerio de Minas y Energía**
