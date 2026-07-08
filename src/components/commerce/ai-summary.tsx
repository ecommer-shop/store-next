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
    <div className="relative">
      <Card className="relative border border-border bg-content1/95 p-3 md:p-4">
        {/* Estrellas + rating en una línea compacta */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating value={averageRating} interactive={false} size="sm" />
          <span className="text-base font-bold">{averageRating}</span>
          <span className="text-xs text-muted-foreground">/ 5</span>
        </div>

        {/* Título */}
        <h3 className="text-sm font-semibold text-foreground mb-1.5">
          {aiSummary ? aiSummary.title : t(I18N.Commerce.ReviewsSection.aiSummary.noReviewsTitle)}
        </h3>

        <p className="text-xs leading-relaxed text-muted-foreground mb-3">
          {aiSummary
            ? aiSummary.summary
            : t(I18N.Commerce.ReviewsSection.aiSummary.noReviewsDescription)}
        </p>

        {/* Footer compacto */}
        <div className="flex items-center justify-between">
          {aiSummary && (
            <span className="text-xs text-muted-foreground">
              {t(I18N.Commerce.ReviewsSection.aiSummary.basedOn, { count: aiSummary.basedOnReviewsCount })}
            </span>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-primary ml-auto"
            onPress={onToggleReviews}
          >
            {showReviews ? t(I18N.Commerce.ReviewsSection.aiSummary.hide) : t(I18N.Commerce.ReviewsSection.aiSummary.showMore)}
          </Button>
        </div>
      </Card>
    </div>
  );
}
