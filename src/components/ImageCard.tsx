'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Tag, Layers, Download, Eye } from 'lucide-react';
import { ImageMetadata } from '@/types';
import { getImageUrl } from '@/lib/data-utils';
import ImageModal from './ImageModal';

interface ImageCardProps {
  image: ImageMetadata;
  viewMode: 'grid' | 'list';
}

export default function ImageCard({ image, viewMode }: ImageCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate image URL - convert file path to web accessible URL
  const imageUrl = getImageUrl(image.ruta_completa);

  const handleImageError = () => {
    setImageError(true);
  };

  if (viewMode === 'list') {
    return (
      <>
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                {!imageError ? (
                  <img
                    src={imageUrl}
                    alt={image.nombre_archivo}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <img src="/placeholder-image.svg" alt="Imagen no disponible" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 mb-2 truncate">
                {image.nombre_archivo}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>{image.escenario}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>{image.periodo}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{image.escala}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Layers className="h-3 w-3" />
                  <span>{image.componente}</span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  image.tipo === 'AMENAZA' ? 'bg-red-100 text-red-700' :
                  image.tipo === 'RIESGO' ? 'bg-orange-100 text-orange-700' :
                  image.tipo === 'VULNERABILIDAD' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {image.tipo}
                </span>
                {image.atributo !== 'NO ESPECIFICA' && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {image.atributo}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                title="Ver imagen"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {showModal && (
          <ImageModal
            image={image}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="aspect-video bg-gray-100 relative group cursor-pointer" onClick={() => setShowModal(true)}>
          {!imageError ? (
            <img
              src={imageUrl}
              alt={image.nombre_archivo}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Tag className="h-12 w-12" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 text-sm truncate" title={image.nombre_archivo}>
            {image.nombre_archivo}
          </h3>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{image.escenario}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{image.periodo}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{image.escala}</span>
              </div>
              <div className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                <span>{image.componente}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                image.tipo === 'AMENAZA' ? 'bg-red-100 text-red-700' :
                image.tipo === 'RIESGO' ? 'bg-orange-100 text-orange-700' :
                image.tipo === 'VULNERABILIDAD' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {image.tipo}
              </span>
            </div>

            {image.atributo !== 'NO ESPECIFICA' && (
              <div className="text-xs text-gray-600 truncate" title={image.atributo}>
                {image.atributo}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ImageModal
          image={image}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}