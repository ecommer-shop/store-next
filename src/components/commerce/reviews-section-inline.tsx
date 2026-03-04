// src/components/commerce/reviews-section.tsx

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { StarRating } from '@/components/ui/star-rating';
import { Card, Button } from "@heroui/react";
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { GetProductReviewsQuery } from '@/lib/vendure/shared/reviews';
import { CheckUserPurchasedProductQuery } from '@/lib/vendure/shared/customer-orders';
import { query } from '@/lib/vendure/client/api';
import { ReviewsList } from './reviews-list';
import { ReviewFormInline } from './review-form-inline';
import { AISummary } from './ai-summary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingBag } from 'lucide-react';
import { getToken } from './getToken';

interface ReviewsSectionProps {
  productId: string;
  variantId?: string;
}

interface Review {
  id: string;
  rating: number;
  product?: {
    id: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingCounts: Array<{
    bin: number;
    frequency: number;
  }>;
}

interface AISummary {
  id: string;
  title: string;
  summary: string;
  basedOnReviewsCount: number;
  generatedAt: string;
}

export function ReviewsSection({ productId, variantId }: ReviewsSectionProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const t = useTranslations();

  // Verificar si el usuario compró el producto
  const checkUserPurchase = async () => {
    setCheckingPurchase(true);
    const token = await getToken()
    try {
      const result = await query(CheckUserPurchasedProductQuery, {}, {authToken: token});

      const activeCustomer = result.data?.activeCustomer;
      
      if (!activeCustomer) {
        setHasPurchased(false);
        return;
      }

      // Verificar si tiene alguna orden con este producto
      const orders = activeCustomer.orders?.items || [];
      const purchased = orders.some((order: any) => 
        order.lines?.some((line: any) => 
          line.productVariant?.product?.id === productId
        )
      );
      setHasPurchased(purchased);
    } catch (error) {
      // Si hay error de autenticación o red, asumir que no ha comprado
      setHasPurchased(false);
    } finally {
      setCheckingPurchase(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const result = await query(GetProductReviewsQuery, {
        productId,
        options: { take: 100 }
      });

      const productReviews = (result.data?.product?.reviews?.items || []) as Review[];

      // Calcular estadísticas
      const totalReviews = productReviews.length;
      const totalRating = productReviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      // Calcular histograma
      const ratingCounts = [5, 4, 3, 2, 1].map(bin => ({
        bin,
        frequency: productReviews.filter((r: Review) => r.rating === bin).length
      }));

      setStats({
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingCounts,
      });
    } catch (error) {
      // Establecer estadísticas por defecto si hay error de red
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: [5, 4, 3, 2, 1].map(bin => ({ bin, frequency: 0 }))
      });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
    checkUserPurchase();
  }, [productId, refreshTrigger]);

  const handleReviewSubmitted = () => {
    toast.success(t(I18N.Commerce.ReviewsSection.success.title), {
      description: t(I18N.Commerce.ReviewsSection.success.description),
    });
    setRefreshTrigger(prev => prev + 1);
  };

  const getRatingPercentage = (bin: number) => {
    if (!stats || stats.totalReviews === 0) return 0;
    const count = stats.ratingCounts.find(item => item.bin === bin)?.frequency || 0;
    return Math.round((count / stats.totalReviews) * 100);
  };

  if (loadingStats || checkingPurchase) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-3">
                <div className="h-5 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Datos para el resumen de IA
  const hasReviews = stats && stats.totalReviews > 0;

  return (
    <div className="space-y-6">
      {/* Formulario - SOLO SI COMPRÓ - PRIMERO */}
      {hasPurchased ? (
        <ReviewFormInline
          productId={productId}
          variantId={variantId}
          onSuccess={handleReviewSubmitted}
        />
      ) : (
        <Alert className="border-muted">
          <ShoppingBag className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {t(I18N.Commerce.ReviewsSection.mustPurchaseFirst) || 
             'Debes comprar este producto antes de dejar una reseña.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Card de IA - SIEMPRE VISIBLE */}
      <AISummary 
        productId={productId} 
        showReviews={showReviews}
        onToggleReviews={() => setShowReviews(!showReviews)}
      />

      <Separator className="my-4" />

      {/* Card de estadísticas - SOLO SI HAY REVIEWS */}
      {hasReviews && (
        <div className="relative">
          {/* Efecto de brillo de fondo */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary opacity-20 blur-lg" />
          
          <Card className="relative border border-primary/50 bg-content1/95 backdrop-blur-md p-4 md:p-5">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="text-xs md:text-sm text-muted-foreground">
                  {t(I18N.Commerce.ReviewsSection.totalReviews, { 
                    count: stats?.totalReviews || 0 
                  })}
                </div>
              </div>

              {/* Distribución de ratings */}
              <div className="space-y-2">
                {Array.from({ length: 5 }, (_, i) => {
                  const rating = 5 - i;
                  const percentage = getRatingPercentage(rating);
                  return (
                    <div key={rating} className="flex items-center gap-2 md:gap-3">
                      <div className="flex items-center gap-1 md:gap-2 w-14 md:w-16">
                        <span className="text-xs md:text-sm text-muted-foreground">{rating}</span>
                        <StarRating value={1} interactive={false} size="sm" />
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-1.5 md:h-2">
                        <div
                          className="bg-primary h-1.5 md:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground w-10 md:w-12 text-right">
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Lista de reviews - OCULTA POR DEFECTO */}
      {showReviews && (
        <ReviewsList 
          productId={productId} 
          limit={10} 
          showPagination={true}
          refreshTrigger={refreshTrigger}
        />
      )}
    </div>
  );
}