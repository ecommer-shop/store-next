// src/components/commerce/ai-summary.tsx

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { StarRating } from '@/components/ui/star-rating';
import { Card, Button, Chip } from "@heroui/react";
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { GetProductReviewsQuery } from '@/lib/vendure/shared/reviews';
import { query } from '@/lib/vendure/client/api';
import { Sparkles } from 'lucide-react';

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
      {/* Efecto de brillo de fondo */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary opacity-20 blur-lg" />
      
      <Card className="relative border border-primary/50 bg-content1/95 backdrop-blur-md p-4 md:p-5">
        {/* Badge superior */}
        <div className="flex w-full items-center justify-between mb-3">
          <Chip 
            color="success" 
            variant="soft" 
            size="sm"
            className="border-success/50 bg-success/20"
          >
            <Sparkles className="h-3 w-3 animate-pulse" />
            {t(I18N.Commerce.ReviewsSection.aiSummary.badge)}
          </Chip>
        </div>

        {/* Estrellas arriba del título */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating value={averageRating} interactive={false} size="md" />
          <span className="text-xl md:text-2xl font-bold">
            {averageRating}
          </span>
          <span className="text-sm text-muted-foreground">/ 5</span>
        </div>

        {/* Título con gradiente */}
        <h3 className="w-full text-left text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
          {aiSummary ? aiSummary.title : t(I18N.Commerce.ReviewsSection.aiSummary.noReviewsTitle)}
        </h3>

        <p className="text-sm leading-relaxed text-default-600 mb-4">
          {aiSummary 
            ? aiSummary.summary 
            : t(I18N.Commerce.ReviewsSection.aiSummary.noReviewsDescription)
          }
        </p>

        {/* Indicador de confianza - SOLO SI HAY RESUMEN DE IA */}
        {aiSummary ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
              <div className="flex h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-xs text-success-600 dark:text-success-400">
                {t(I18N.Commerce.ReviewsSection.aiSummary.basedOn, { count: aiSummary.basedOnReviewsCount })}
              </span>
            </div>
            
            {/* Botón pequeño en esquina inferior derecha */}
            <Button
              size="sm"
              variant="ghost"
              className="text-primary"
              onPress={onToggleReviews}
            >
              {showReviews ? t(I18N.Commerce.ReviewsSection.aiSummary.hide) : t(I18N.Commerce.ReviewsSection.aiSummary.showMore)}
            </Button>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="text-primary"
              onPress={onToggleReviews}
            >
              {showReviews ? t(I18N.Commerce.ReviewsSection.aiSummary.hide) : t(I18N.Commerce.ReviewsSection.aiSummary.showMore)}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
