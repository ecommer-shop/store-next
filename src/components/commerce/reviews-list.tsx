// src/components/commerce/reviews-list.tsx

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { StarRating } from '@/components/ui/star-rating';
import { Button, Card } from "@heroui/react";
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { GetProductReviewsQuery, VoteOnReviewMutation } from '@/lib/vendure/shared/reviews';
import { query } from '@/lib/vendure/client/api';

interface ReviewsListProps {
  productId: string;
  limit?: number;
  showPagination?: boolean;
  refreshTrigger?: number;
}

interface Review {
  id: string;
  summary: string;
  body: string;
  rating: number;
  authorName: string;
  authorLocation?: string;
  upvotes: number;
  downvotes: number;
  state: string;
  createdAt: string;
}

export function ReviewsList({ 
  productId, 
  limit = 5, 
  showPagination = true,
  refreshTrigger = 0 
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const t = useTranslations();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const result = await query(GetProductReviewsQuery, {
        productId,
        options: {
          take: limit,
          skip: (page - 1) * limit,
          sort: { createdAt: 'DESC' },
        },
      });

      if (result.data?.product?.reviews) {
        setReviews(result.data.product.reviews.items as Review[]);
        setTotalItems(result.data.product.reviews.totalItems);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error(t(I18N.Commerce.ReviewsList.error.title), {
        description: t(I18N.Commerce.ReviewsList.error.fetchError),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, page, refreshTrigger]);

  const handleVote = async (reviewId: string, helpful: boolean) => {
    try {
      const result = await query(VoteOnReviewMutation, {
        id: reviewId,
        vote: helpful,
      });

      if (result.data?.voteOnReview) {
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? {
                  ...review,
                  upvotes: helpful ? review.upvotes + 1 : review.upvotes,
                  downvotes: helpful ? review.downvotes : review.downvotes + 1,
                }
              : review
          )
        );

        toast.success(t(I18N.Commerce.ReviewsList.vote.success.title), {
          description: helpful
            ? t(I18N.Commerce.ReviewsList.vote.success.helpful)
            : t(I18N.Commerce.ReviewsList.vote.success.notHelpful),
        });
      }
    } catch (error: any) {
      console.error('Error voting on review:', error);
      toast.error(t(I18N.Commerce.ReviewsList.vote.error.title), {
        description: error?.message || t(I18N.Commerce.ReviewsList.vote.error.networkError),
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalPages = Math.ceil(totalItems / limit);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-5 bg-muted rounded w-1/4 mb-3"></div>
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 md:p-5 mb-3">
              <div className="p-4 md:p-5 flex items-center gap-4 mb-4">
                <div className="p-4 md:p-5 w-12 h-12 bg-muted rounded-full"></div>
                <div className="p-4 md:p-5 flex-1">
                  <div className="p-4 md:p-5 h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="p-4 md:p-5 h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
              <div className="p-4 md:p-5 space-y-2">
                <div className="p-4 md:p-5 h-4 bg-muted rounded w-full"></div>
                <div className="p-4 md:p-5 h-4 bg-muted rounded w-3/4"></div>
                <div className="p-4 md:p-5 h-4 bg-muted rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">{t(I18N.Commerce.ReviewsList.empty.title)}</h3>
        <p className="text-muted-foreground">{t(I18N.Commerce.ReviewsList.empty.description)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">{t(I18N.Commerce.ReviewsList.title)}</h3>
        <div className="text-sm text-muted-foreground">
          {t(I18N.Commerce.ReviewsList.count, { count: totalItems })}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4 md:p-5 hover:shadow-md transition-shadow">
            {/* Header: Author and Rating */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>{getInitials(review.authorName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{review.authorName}</div>
                  {review.authorLocation && (
                    <div className="text-sm text-muted-foreground">{review.authorLocation}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">{formatDate(review.createdAt)}</div>
                </div>
              </div>
              <div className="text-right">
                <StarRating value={review.rating} interactive={false} size="sm" />
                <div className="text-xs text-muted-foreground mt-1">
                  {t(I18N.Commerce.ReviewsList.rating, { rating: review.rating })}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Content */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">{review.summary}</h4>
              <p className="text-foreground/80 leading-relaxed">{review.body}</p>
            </div>

            {/* Footer: Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>
                  {t(I18N.Commerce.ReviewsList.helpful, { 
                    count: review.upvotes,
                    total: review.upvotes + review.downvotes 
                  })}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(review.id, true)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {t(I18N.Commerce.ReviewsList.actions.helpful)}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(review.id, false)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  {t(I18N.Commerce.ReviewsList.actions.notHelpful)}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <Button
            variant="ghost"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            isDisabled={page === 1}
            className="px-4"
          >
            ← {t(I18N.Commerce.ReviewsList.pagination.previous)}
          </Button>
          
          <div className="text-sm text-muted-foreground px-4">
            {t(I18N.Commerce.ReviewsList.pagination.pageInfo, { 
              current: page, 
              total: totalPages 
            })}
          </div>

          <Button
            variant="ghost"
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            isDisabled={page === totalPages}
            className="px-4"
          >
            {t(I18N.Commerce.ReviewsList.pagination.next)} →
          </Button>
        </div>
      )}
    </div>
  );
}