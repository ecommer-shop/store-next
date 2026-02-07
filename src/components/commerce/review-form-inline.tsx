// src/components/commerce/review-form-inline.tsx

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { StarRating } from '@/components/ui/star-rating';
import { Button, Card } from "@heroui/react";
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { SubmitProductReviewMutation } from '@/lib/vendure/shared/reviews';
import { query } from '@/lib/vendure/client/api';

// Esquema simplificado - solo rating y body
const reviewSchema = z.object({
  rating: z.number().min(1, 'Debes seleccionar una calificación').max(5),
  body: z
    .string()
    .min(10, 'La reseña debe tener al menos 10 caracteres')
    .max(5000, 'La reseña debe tener máximo 5000 caracteres'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormInlineProps {
  productId: string;
  variantId?: string;
  onSuccess?: () => void;
}

export function ReviewFormInline({ productId, variantId, onSuccess }: ReviewFormInlineProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);
  const { user, isLoaded } = useUser();
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    mode: 'onChange',
    defaultValues: {
      rating: 0,
      body: '',
    },
  });

  const watchedRating = watch('rating');
  const watchedBody = watch('body');

  useEffect(() => {
    const checkPurchase = async () => {
      if (!isLoaded || !user) {
        setHasPurchased(false);
        return;
      }

      try {
        setHasPurchased(true);
      } catch (error) {
        setHasPurchased(false);
      }
    };

    checkPurchase();
  }, [user, isLoaded, productId]);

  const handleExpand = () => {
    if (!user) {
      toast.error(t(I18N.Commerce.ReviewForm.auth.loginRequired), {
        description: t(I18N.Commerce.ReviewForm.auth.loginDescription),
      });
      return;
    }
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    reset();
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast.error(t(I18N.Commerce.ReviewForm.auth.loginRequired));
      return;
    }

    setIsSubmitting(true);

    try {
      // Obtener nombre del usuario de Clerk
      const authorName = user.fullName || user.firstName || 'Usuario';
      
      // Generar summary automático (primeras palabras)
      const summary = data.body.substring(0, 100).trim();

      const result = await query(SubmitProductReviewMutation, {
        input: {
          productId,
          variantId,
          summary, // Auto-generado
          body: data.body.trim(),
          rating: data.rating,
          authorName, // Desde Clerk
          // authorLocation eliminado
        },
      });

      if (result.data?.submitProductReview) {
        toast.success(t(I18N.Commerce.ReviewForm.success.title), {
          description: t(I18N.Commerce.ReviewForm.success.description),
        });
        reset();
        setIsExpanded(false);
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);

      if (error?.message?.includes('purchase') || error?.message?.includes('comprar')) {
        setHasPurchased(false);
        setIsExpanded(false);
      }
      
      const errorMessage = error?.message || t(I18N.Commerce.ReviewForm.error.networkError);
      
      toast.error(t(I18N.Commerce.ReviewForm.error.title), {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || !user || hasPurchased === false) {
    return null;
  }

  if (hasPurchased === null) {
    return null; // O un skeleton si prefieres
  }

  // Vista colapsada - botón para expandir
  if (!isExpanded) {
    return (
      <Card className="p-4"> 
        <Button
          onClick={handleExpand}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          ✍️ {t(I18N.Commerce.ReviewForm.writeReviewPlaceholder)}
        </Button>
      </Card>
    );
  }

  // Vista expandida - formulario completo
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Rating con estrellas */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {t(I18N.Commerce.ReviewForm.yourRating)}
            </span>
            <StarRating
              value={watchedRating}
              interactive={true}
              onRatingChange={(rating) => setValue('rating', rating, { shouldValidate: true })}
              size="lg"
            />
          </div>
          {errors.rating && (
            <p className="text-sm text-destructive">{errors.rating.message}</p>
          )}
        </div>

        {/* Textarea para el comentario */}
        <div className="space-y-2">
          <Textarea
            placeholder={t(I18N.Commerce.ReviewForm.fields.body.placeholder)}
            {...register('body')}
            className={errors.body ? 'border-destructive' : ''}
            rows={4}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{errors.body?.message || ''}</span>
            <span>{watchedBody?.length || 0}/5000</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            isDisabled={isSubmitting}
          >
            {t(I18N.Commerce.ReviewForm.actions.cancel)}
          </Button>
          <Button
            type="submit"
            isDisabled={!isValid || isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t(I18N.Commerce.ReviewForm.actions.submitting)}
              </>
            ) : (
              t(I18N.Commerce.ReviewForm.actions.submit)
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}