// src/components/commerce/ai-summary.tsx

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { StarRating } from '@/components/ui/star-rating';
import { Card, Button } from "@heroui/react";
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { GetProductReviewsQuery } from '@/lib/vendure/shared/reviews';
import { query } from '@/lib/vendure/client/api';

interface AISummaryProps {
  productId: string;
  onToggleReviews: () => void;
  showReviews: boolean;
}

interface AISummary {
  id: string;
  title: string;
  summary: string;
  basedOnReviewsCount: number;
  generatedAt: string;
}

export function AISummary({ productId, onToggleReviews, showReviews }: AISummaryProps) {
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  const fetchAISummary = async () => {
    setLoading(true);
    try {
      const result = await query(GetProductReviewsQuery, {
        productId,
        options: { take: 100 }
      });

      const productReviews = result.data?.product?.reviews?.items || [];

      // Calcular average rating
      const reviewsLength = productReviews.length;
      if (reviewsLength > 0) {
        const totalRating = productReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
        setAverageRating(Math.round((totalRating / reviewsLength) * 10) / 10);
      } else {
        setAverageRating(0);
      }
      setTotalReviews(reviewsLength);

      // Obtener el resumen de IA desde Vendure
      const summaryData = result.data?.product?.aiSummary;
      if (summaryData) {
        setAiSummary({
          id: summaryData.id,
          title: summaryData.title,
          summary: summaryData.summary,
          basedOnReviewsCount: summaryData.basedOnReviewsCount,
          generatedAt: summaryData.generatedAt,
        });
      } else {
        setAiSummary(null);
      }
    } catch (error) {
      console.error('Error fetching AI summary:', error);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAISummary();
  }, [productId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <Card className="p-4 md:p-5">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border border-border bg-content1/95 p-3">
      {/* Header compacto con estrellas en línea */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StarRating value={averageRating} interactive={false} size="sm" />
            <span className="text-sm font-bold">{averageRating}</span>
            <span className="text-xs text-muted-foreground">/ 5</span>
          </div>
          <h3 className="text-sm font-semibold text-foreground line-clamp-1">
            {aiSummary ? aiSummary.title : t(I18N.Commerce.ReviewsSection.aiSummary.noReviewsTitle)}
          </h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-primary text-xs shrink-0"
          onPress={onToggleReviews}
        >
          {showReviews ? 'Ocultar' : 'Ver más'}
        </Button>
      </div>

      {/* Summary compacto */}
      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {aiSummary
          ? aiSummary.summary
          : t(I18N.Commerce.ReviewsSection.aiSummary.noReviewsDescription)}
      </p>

      {/* Footer mini */}
      {aiSummary && totalReviews > 0 && (
        <div className="text-xs text-muted-foreground mt-2">
          Basado en {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
        </div>
      )}
    </Card>
  );
}
