import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageViewerModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  title?: string;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
  title
}) => {
  const handlePrev = useCallback(() => {
    onSelectIndex((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    onSelectIndex((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onSelectIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-6 animate-in fade-in select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Maximize2 className="w-5 h-5 text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wide">
            {title || 'Gallery Preview'} ({currentIndex + 1} / {images.length})
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Large Image */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <button
          onClick={handlePrev}
          className="absolute left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          referrerPolicy="no-referrer"
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-all"
        />

        <button
          onClick={handleNext}
          className="absolute right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails Row */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelectIndex(idx)}
            className={`w-16 h-12 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
              currentIndex === idx ? 'border-amber-400 scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
