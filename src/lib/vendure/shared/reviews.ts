// src/lib/vendure/shared/reviews.ts

import { graphql } from 'gql.tada';

// Fragmento base de Review
export const ReviewFragment = graphql(`
  fragment ReviewFragment on ProductReview {
    id
    createdAt
    updatedAt
    summary
    body
    rating
    authorName
    authorLocation
    verifiedPurchase
    upvotes
    downvotes
    state
    response
    responseCreatedAt
  }
`);

// Fragmento de resumen de IA
export const ProductAISummaryFragment = graphql(`
  fragment ProductAISummary on ProductAISummary {
    id
    title
    summary
    basedOnReviewsCount
    generatedAt
  }
`);

// Query para obtener reviews de un producto
export const GetProductReviewsQuery = graphql(`
  query GetProductReviews($productId: ID!, $options: ProductReviewListOptions) {
    product(id: $productId) {
      id
      reviews(options: $options) {
        items {
          ...ReviewFragment
        }
        totalItems
      }
      aiSummary {
        ...ProductAISummary
      }
    }
  }
`, [ReviewFragment, ProductAISummaryFragment]);

// Query para obtener histograma de ratings
export const GetProductReviewsHistogramQuery = graphql(`
  query GetProductReviewsHistogram($productId: ID!) {
    product(id: $productId) {
      id
      reviewsHistogram {
        bin
        frequency
      }
    }
  }
`);

// Mutation para crear review
export const SubmitProductReviewMutation = graphql(`
  mutation SubmitProductReview($input: SubmitProductReviewInput!) {
    submitProductReview(input: $input) {
      ...ReviewFragment
    }
  }
`, [ReviewFragment]);

// Mutation para votar en un review
export const VoteOnReviewMutation = graphql(`
  mutation VoteOnReview($id: ID!, $vote: Boolean!) {
    voteOnReview(id: $id, vote: $vote) {
      ...ReviewFragment
    }
  }
`, [ReviewFragment]);