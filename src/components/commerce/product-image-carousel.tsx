'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button, Tabs } from '@heroui/react';
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

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No images available</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Miniaturas verticales para desktop */}
            <div className="hidden lg:flex lg:flex-col lg:w-20 lg:gap-2">
                {images.map((image, index) => (
                    <Button
                        key={image.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative w-15 h-15 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentIndex
                                ? 'border-primary'
                                : 'border-transparent hover:border-muted-foreground'
                        }`}
                        aria-label={`View image ${index + 1}`}
                    >
                        <Image
                            src={image.preview}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </Button>
                ))}
            </div>

            {/* Contenedor principal de la imagen */}
            <div className="flex-1">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <div className="relative w-full h-full">
                        <Image
                            src={images[currentIndex].source}
                            alt={`Product image ${currentIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={currentIndex === 0}
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <Button
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground"
                                size="sm"
                                isIconOnly
                                onClick={goToPrevious}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground"
                                size="sm"
                                isIconOnly
                                onClick={goToNext}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 text-sm font-medium">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Tabs para mobile/tablet */}
                <div className="flex lg:hidden flex-row justify-center mt-1 w-50 gap-3">
                {images.map((image, index) => (
                    <Button
                        key={image.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative w-15 h-15 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentIndex
                                ? 'border-primary'
                                : 'border-transparent hover:border-muted-foreground'
                        }`}
                        aria-label={`View image ${index + 1}`}
                    >
                        <Image
                            src={image.preview}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </Button>
                ))}
            </div>
            </div>
        </div>
    );
}