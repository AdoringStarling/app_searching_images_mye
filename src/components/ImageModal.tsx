'use client';

import React from 'react';
import { X, Download, Calendar, MapPin, Tag, Layers, Folder } from 'lucide-react';
import { ImageMetadata } from '@/types';
import { getImageUrl } from '@/lib/data-utils';

interface ImageModalProps {
  image: ImageMetadata;
  onClose: () => void;
}

export default function ImageModal({ image, onClose }: ImageModalProps) {
  const imageUrl = getImageUrl(image.ruta_completa);
  const handleDownload = () => {
    // Create download link - this would need to be implemented based on actual file hosting
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = image.nombre_archivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 truncate pr-4">
            {image.nombre_archivo}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              title="Descargar imagen"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              title="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Image */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            <img
              src={imageUrl}
              alt={image.nombre_archivo}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.svg';
              }}
            />
          </div>

          {/* Metadata Panel */}
          <div className="w-80 bg-white border-l overflow-y-auto">
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Información de la imagen</h3>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Escenario</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    image.escenario === 'REFERENCIA' ? 'bg-gray-100 text-gray-800' :
                    image.escenario === 'SSP245' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {image.escenario}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Período</span>
                  </div>
                  <p className="text-sm text-gray-900">{image.periodo}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Escala</span>
                  </div>
                  <p className="text-sm text-gray-900">{image.escala}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Layers className="h-4 w-4" />
                    <span className="font-medium">Componente</span>
                  </div>
                  <p className="text-sm text-gray-900">{image.componente}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">Tipo</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    image.tipo === 'AMENAZA' ? 'bg-red-100 text-red-800' :
                    image.tipo === 'RIESGO' ? 'bg-orange-100 text-orange-800' :
                    image.tipo === 'VULNERABILIDAD' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {image.tipo}
                  </span>
                </div>

                {image.sector && image.sector !== 'NO ESPECIFICA' && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Folder className="h-4 w-4" />
                      <span className="font-medium">Sector</span>
                    </div>
                    <p className="text-sm text-gray-900">{image.sector}</p>
                  </div>
                )}

                {image.sub_sector && image.sub_sector !== 'NO ESPECIFICA' && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Folder className="h-4 w-4" />
                      <span className="font-medium">Sub-Sector</span>
                    </div>
                    <p className="text-sm text-gray-900">{image.sub_sector}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">Atributo</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {image.atributo === 'NO ESPECIFICA' ? (
                      <span className="text-gray-500 italic">No especifica</span>
                    ) : (
                      image.atributo
                    )}
                  </p>
                </div>
              </div>

              {/* File Path */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Folder className="h-4 w-4" />
                  <span className="font-medium">Ruta del archivo</span>
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded break-all">
                  {image.tema_principal}
                  {image.subcarpeta_1 && ` / ${image.subcarpeta_1}`}
                  {image.subcarpeta_2 && ` / ${image.subcarpeta_2}`}
                  {image.subcarpeta_3 && ` / ${image.subcarpeta_3}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}