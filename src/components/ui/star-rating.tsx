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

  const getStarColor = (starIndex: number) => {
    const rating = hoveredRating ?? currentRating;
    
    if (rating >= starIndex) {
      return 'text-yellow-400 fill-yellow-400';
    }
    
    if (rating >= starIndex - 0.5 && rating < starIndex) {
      return 'text-yellow-400 fill-transparent';
    }
    
    return 'text-gray-300';
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={cn('flex gap-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const starIndex = index + 1;
        const isHalfStar = (hoveredRating ?? currentRating) >= starIndex - 0.5 && 
                          (hoveredRating ?? currentRating) < starIndex;

        return (
          <button
            key={starIndex}
            type="button"
            disabled={!interactive || disabled}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            className={cn(
              'transition-colors duration-200',
              interactive && !disabled && 'cursor-pointer hover:scale-110',
              getStarColor(starIndex)
            )}
            aria-label={`Calificar ${starIndex} de ${maxStars}`}
          >
            <Star className={sizeClasses[size]} />
            {isHalfStar && (
              <div className="absolute inset-0 overflow-hidden">
                <Star className={cn(sizeClasses[size], 'text-yellow-400 fill-yellow-400')} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}