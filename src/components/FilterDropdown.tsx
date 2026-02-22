'use client';

import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

export default function FilterDropdown({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = 'Seleccionar...' 
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option === value ? undefined : option);
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div
        className={`relative w-full border rounded-lg px-3 py-2 cursor-pointer transition-colors ${
          isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
          
          <div className="flex items-center gap-1">
            {value && (
              <button
                onClick={clearSelection}
                className="p-1 hover:bg-gray-100 rounded"
                title="Limpiar"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            )}
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                    value === option ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 italic">
                No hay opciones disponibles
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}