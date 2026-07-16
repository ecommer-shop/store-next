// src/components/ui/star-rating.tsx

'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/vendure/shared/utils';

interface StarRatingProps {
  value?: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  disabled?: boolean;
  className?: string;
}

export function StarRating({
  value = 0,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  disabled = false,
  className,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState<number>(value);

  const handleStarClick = (rating: number) => {
    if (!interactive || disabled) return;
    
    const newRating = currentRating === rating ? 0 : rating;
    setCurrentRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleStarHover = (rating: number) => {
    if (!interactive || disabled) return;
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    if (!interactive || disabled) return;
    setHoveredRating(null);
  };

  const getStarFillPercentage = (starIndex: number) => {
    const rating = hoveredRating ?? currentRating;
    
    // Estrella completamente llena
    if (rating >= starIndex) {
      return 100;
    }
    
    // Media estrella o fracción
    if (rating > starIndex - 1 && rating < starIndex) {
      return (rating - (starIndex - 1)) * 100;
    }
    
    // Estrella vacía
    return 0;
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={cn('flex gap-0.5', className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const starIndex = index + 1;
        const fillPercentage = getStarFillPercentage(starIndex);

        return (
          <button
            key={starIndex}
            type="button"
            disabled={!interactive || disabled}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            className={cn(
              'relative transition-transform duration-200',
              interactive && !disabled && 'cursor-pointer hover:scale-110'
            )}
            aria-label={`Calificar ${starIndex} de ${maxStars}`}
          >
            {/* Star outline (background) */}
            <Star 
              className={cn(
                sizeClasses[size], 
                'text-gray-300 dark:text-gray-600'
              )} 
              strokeWidth={1.5}
            />
            
            {/* Star fill (overlay) */}
            {fillPercentage > 0 && (
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ 
                  clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` 
                }}
              >
                <Star 
                  className={cn(
                    sizeClasses[size], 
                    'text-yellow-400 fill-yellow-400 dark:text-yellow-500 dark:fill-yellow-500'
                  )}
                  strokeWidth={1.5}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}