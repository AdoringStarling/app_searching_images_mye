# SIAVRA - MME

## Descripción
Sistema de Información Climática del MME. Permite filtrar y buscar entre 1,064+ imágenes con filtros inteligentes en cascada.

## Requisitos del Sistema
- **Node.js** versión 18.0 o superior
- **npm** (incluido con Node.js) o **yarn**
- **Navegador web** moderno (Chrome, Firefox, Safari, Edge)

## Instalación Paso a Paso

### 1. Verificar Node.js
Abrir terminal/consola y verificar que Node.js esté instalado:
```bash
node --version
npm --version
```
Si no está instalado, descargar desde [https://nodejs.org](https://nodejs.org)

### 2. Navegar al directorio del proyecto
```bash
cd D:\app-img-01\app
```

### 3. Instalar dependencias
```bash
npm install
```
Este comando instala todas las librerías necesarias (Next.js, React, TypeScript, etc.)

### 4. Verificar archivos de datos
Asegurar que existan estos archivos:
- `public/data/inventario_imagenes.csv` - Base de datos de imágenes
- `public/images/` - Carpeta con las imágenes (525+ archivos JPG)

## Comandos para Ejecutar

### Modo Desarrollo (Recomendado para uso diario)
```bash
npm run dev
```
- La aplicación se abre en: **http://localhost:3000**
- Se recarga automáticamente al hacer cambios
- Para detener: `Ctrl + C` en la terminal

### Modo Producción (Para despliegue)
```bash
npm run build
npm start
```
- Primero compila la aplicación optimizada
- Luego la ejecuta en modo producción
- Más rápida pero no se recarga automáticamente

## Verificar que Funciona

### 1. Abrir navegador
Ir a: `http://localhost:3000`

### 2. Probar filtros
- Seleccionar "Escenario" → elegir "SSP245"
- Ver que otros filtros se actualicen automáticamente
- Hacer clic en "Consultar"
- Verificar que aparezcan imágenes

### 3. Probar búsqueda
- Escribir texto como "amenaza" en el buscador
- Hacer clic en "Consultar"
- Ver resultados filtrados

## Estructura del Proyecto
```
app/
├── public/
│   ├── data/
│   │   └── inventario_imagenes.csv    # Base de datos (1,064+ registros)
│   ├── images/                        # Imágenes físicas (525+ archivos)
│   └── placeholder-image.svg          # Imagen por defecto
├── src/
│   ├── app/
│   │   ├── api/                       # APIs del servidor
│   │   └── page.tsx                   # Página principal
│   ├── components/                    # Componentes React
│   ├── lib/                          # Utilidades de datos
│   └── types/                        # Tipos TypeScript
├── package.json                       # Configuración y dependencias
└── README.md                         # Este archivo
```

## Funcionalidades del Sistema

### Filtros Inteligentes en Cascada
Los filtros se actualizan automáticamente según las selecciones:
- **Escenario**: REFERENCIA, SSP245, SSP370
- **Período**: 1990-2021, 2041-2060, 2081-2100, etc.
- **Escala**: Territorial, Sectorial
- **Sector**: Hidrocarburos, Minería, Energía
- **Sub-Sector**: Producción, Transporte, Exploración, Generación
- **Componente**: Biótico, Hábitat Humano, Infraestructura, Salud Humana
- **Tipo**: AMENAZA, VULNERABILIDAD, RIESGO, SENSIBILIDAD, etc.
- **Atributo**: Específicos por imagen

### Búsqueda por Texto
Busca en nombres de archivos, componentes, tipos y atributos

### Visualización
- **Vista Cuadrícula**: Tarjetas con imágenes
- **Vista Lista**: Formato compacto
- **Modal Detallado**: Información completa al hacer clic

## Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
# Usar otro puerto
npm run dev -- -p 3001
```

### Las imágenes no se muestran
1. Verificar que `public/images/` contenga archivos JPG
2. Verificar que los nombres en el CSV coincidan con los archivos
3. Revisar consola del navegador (F12) por errores

### Filtros vacíos
1. Verificar que `public/data/inventario_imagenes.csv` exista
2. Verificar que el CSV tenga el formato correcto (17 columnas)
3. Revisar consola por errores de carga de datos

## Comandos Adicionales

```bash
# Verificar errores de código
npm run lint

# Compilar para producción
npm run build

# Ver qué puertos están ocupados (Windows)
netstat -an | findstr :3000
```

## Soporte Técnico

**Tecnologías utilizadas:**
- Next.js 16.1.6 (Framework React)
- TypeScript (Tipado estático)  
- Tailwind CSS (Estilos)
- Lucide React (Iconos)

**Rendimiento:**
- Carga bajo demanda (no procesa 1,064+ imágenes al inicio)
- Filtros dinámicos basados en datos reales
- Optimizado para datasets grandes
- Responsive design para móvil/desktop

---
**Ministerio de Minas y Energía - Universidad Nacional de Colombia**
