// src/lib/vendure/shared/customer-orders.ts

import { graphql } from 'gql.tada';

export const CheckUserPurchasedProductQuery = graphql(`
  query CheckUserPurchasedProduct {
    activeCustomer {
      id
      orders(options: { 
        filter: { 
          state: { in: ["PaymentSettled", "Delivered", "Shipped", "PartiallyDelivered"] }
        }
      }) {
        items {
          id
          lines {
            productVariant {
              product {
                id
              }
            }
          }
        }
      }
    }
  }
`);