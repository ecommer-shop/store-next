'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
    images: Array<{
        id: string;
        preview: string;
        source: string;
    }>;
}

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1));
    const goToNext     = () => setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1));

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] bg-muted rounded-2xl flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Sin imagen</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {/* ── Imagen principal ── */}
            <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted"
                style={{
                    border: '2px solid #9969F8',
                    boxShadow: '0 0 0 1px rgba(153,105,248,0.15), 0 4px 24px rgba(153,105,248,0.12)',
                }}
            >
                <Image
                    src={images[currentIndex].source}
                    alt={`Imagen del producto ${currentIndex + 1}`}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority={currentIndex === 0}
                />

                {/* Flechas — solo si hay más de una imagen */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            aria-label="Imagen anterior"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                                       w-8 h-8 rounded-full flex items-center justify-center
                                       bg-white/80 dark:bg-[#12123F]/80 shadow
                                       border border-gray-200 dark:border-white/10
                                       hover:scale-110 transition-all"
                        >
                            <ChevronLeft className="size-4 text-gray-700 dark:text-white" />
                        </button>
                        <button
                            onClick={goToNext}
                            aria-label="Siguiente imagen"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                                       w-8 h-8 rounded-full flex items-center justify-center
                                       bg-white/80 dark:bg-[#12123F]/80 shadow
                                       border border-gray-200 dark:border-white/10
                                       hover:scale-110 transition-all"
                        >
                            <ChevronRight className="size-4 text-gray-700 dark:text-white" />
                        </button>
                    </>
                )}

                {/* Contador */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/40 text-white">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* ── Miniaturas ── */}
            {images.length > 1 && (
                <div className="flex flex-row gap-2 flex-wrap">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Ver imagen ${index + 1}`}
                            className="relative w-14 h-14 rounded-lg overflow-hidden transition-all hover:scale-105"
                            style={{
                                border: index === currentIndex
                                    ? '2px solid #9969F8'
                                    : '2px solid transparent',
                                background: 'var(--muted)',
                            }}
                        >
                            <Image
                                src={image.preview}
                                alt={`Miniatura ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="56px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
