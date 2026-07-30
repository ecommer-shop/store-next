import { graphql } from '@/graphql';
import { ActiveCustomerFragment, ProductCardFragment } from './fragments';

export const GetTopCollectionsQuery = graphql(`
    query GetTopCollections {
        collections(options: { filter: { parentId: { eq: "1" } }, 
            take: 3 }) {
            items {
                id
                name
                slug
            }
        }
    }
`);

export const GetActiveCustomerQuery = graphql(`
    query GetActiveCustomer {
        activeCustomer {
            ...ActiveCustomer
        }
    }
`, [ActiveCustomerFragment]);

export const SearchProductsQuery = graphql(`
    query SearchProducts($input: SearchInput!) {
        search(input: $input) {
            totalItems
            items {
                ...ProductCard
            }
            facetValues {
                count
                facetValue {
                    id
                    name
                    facet {
                        id
                        name
                    }
                }
            }
        }
    }
`, [ProductCardFragment]);

export const GetProductsFallbackQuery = graphql(`
    query GetProductsFallback($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                name
                slug
                featuredAsset {
                    id
                    preview
                }
                variants {
                    priceWithTax
                    currencyCode
                }
                collections {
                    id
                    name
                    slug
                }
                sellerShop {
                    sellerName
                    channelCode
                }
            }
        }
    }
`);

export const GetProductDetailQuery = graphql(`
    query GetProductDetail($slug: String!) {
        product(slug: $slug) {
            id
            name
            description
            slug
            sellerShop {
                channelCode
                sellerName
            }
            assets {
                id
                preview
                source
            }
            variants {
                id
                name
                sku
                priceWithTax
                stockLevel
                options {
                    id
                    code
                    name
                    groupId
                    group {
                        id
                        code
                        name
                    }
                }
            }
            optionGroups {
                id
                code
                name
                options {
                    id
                    code
                    name
                }
            }
            collections {
                id
                name
                slug
                parent {
                    id
                    name
                    slug
                }
            }
        }
    }
`);

/** Misma query que {@link GetProductDetailQuery}, sin campo `sellerShop`, para backends sin plugin store-page nuevo. */
export const GetProductDetailLegacyQuery = graphql(`
    query GetProductDetailLegacy($slug: String!) {
        product(slug: $slug) {
            id
            name
            description
            slug
            assets {
                id
                preview
                source
            }
            variants {
                id
                name
                sku
                priceWithTax
                stockLevel
                options {
                    id
                    code
                    name
                    groupId
                    group {
                        id
                        code
                        name
                    }
                }
            }
            optionGroups {
                id
                code
                name
                options {
                    id
                    code
                    name
                }
            }
            collections {
                id
                name
                slug
                parent {
                    id
                    name
                    slug
                }
            }
        }
    }
`);

export const GetActiveOrderQuery = graphql(`
    query GetActiveOrder {
        activeOrder {
            id
            code
            state
            totalQuantity
            subTotal
            subTotalWithTax
            shipping
            shippingWithTax
            total
            totalWithTax
            currencyCode
            couponCodes
            discounts {
                description
                amountWithTax
            }
            lines {
                id
                productVariant {
                    id
                    name
                    sku
                    product {
                        id
                        name
                        slug
                        featuredAsset {
                            id
                            preview
                        }
                    }
                }
                unitPriceWithTax
                quantity
                linePriceWithTax
            }
        }
    }
`);

export const GetActiveOrderForCheckoutQuery = graphql(`
    query GetActiveOrderForCheckout {
        activeOrder {
            id
            code
            state
            totalQuantity
            subTotal
            subTotalWithTax
            shipping
            shippingWithTax
            total
            totalWithTax
            currencyCode
            couponCodes
            customer {
                id
                firstName
                lastName
                emailAddress
            }
            shippingAddress {
                fullName
                company
                streetLine1
                streetLine2
                city
                province
                postalCode
                country
                phoneNumber
                customFields {
                    matiasCityId
                    dni
                    identityDocumentId
                    latitude
                    longitude
                    neighborhood
                    googlePlaceId
                }
            }
            billingAddress {
                fullName
                company
                streetLine1
                streetLine2
                city
                province
                postalCode
                country
                phoneNumber
                customFields {
                    matiasCityId
                    dni
                    identityDocumentId
                    latitude
                    longitude
                    neighborhood
                    googlePlaceId
                }
            }
            shippingLines {
                shippingMethod {
                    id
                    name
                    description
                }
                priceWithTax
            }
            discounts {
                description
                amountWithTax
            }
            lines {
                id
                productVariant {
                    id
                    name
                    sku
                    product {
                        id
                        name
                        slug
                        featuredAsset {
                            id
                            preview
                        }
                    }
                }
                unitPriceWithTax
                quantity
                linePriceWithTax
            }
        }
    }
`);

export const GetCustomerAddressesQuery = graphql(`
    query GetCustomerAddresses {
        activeCustomer {
            id
            addresses {
                id
                fullName
                company
                streetLine1
                streetLine2
                city
                province
                postalCode
                country {
                    id
                    code
                    name
                }
                phoneNumber
                customFields {
                    matiasCityId
                    dni
                    identityDocumentId
                    latitude
                    longitude
                    neighborhood
                    googlePlaceId
                }
                defaultShippingAddress
                defaultBillingAddress
            }
        }
    }
`);

export const GetEligibleShippingMethodsQuery = graphql(`
    query GetEligibleShippingMethods {
        eligibleShippingMethods {
            id
            name
            code
            description
            priceWithTax
        }
    }
`);

export const GetEligiblePaymentMethodsQuery = graphql(`
    query GetEligiblePaymentMethods {
        eligiblePaymentMethods {
            id
            name
            code
            description
            isEligible
            eligibilityMessage
        }
    }
`);

export const GetAvailableCountriesQuery = graphql(`
    query GetAvailableCountries {
        availableCountries {
            id
            code
            name
        }
    }
`);

export const GetCustomerOrdersQuery = graphql(`
    query GetCustomerOrders($options: OrderListOptions) {
        activeCustomer {
            id
            orders(options: $options) {
                totalItems
                items {
                    id
                    code
                    state
                    totalWithTax
                    currencyCode
                    createdAt
                    updatedAt
                    lines {
                        id
                        productVariant {
                            id
                            name
                            product {
                                id
                                name
                                featuredAsset {
                                    id
                                    preview
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`);

export const GetOrderDetailQuery = graphql(`
    query GetOrderDetail($code: String!) {
        orderByCode(code: $code) {
            id
            code
            state
            active
            createdAt
            updatedAt
            totalQuantity
            subTotal
            subTotalWithTax
            shipping
            shippingWithTax
            total
            totalWithTax
            currencyCode
            customer {
                id
                firstName
                lastName
                emailAddress
            }
            shippingAddress {
                fullName
                company
                streetLine1
                streetLine2
                city
                province
                postalCode
                country
                phoneNumber
            }
            billingAddress {
                fullName
                company
                streetLine1
                streetLine2
                city
                province
                postalCode
                country
                phoneNumber
            }
            shippingLines {
                shippingMethod {
                    id
                    name
                    description
                }
                priceWithTax
            }
            payments {
                id
                method
                amount
                state
                transactionId
                createdAt
            }
            lines {
                id
                productVariant {
                    id
                    name
                    sku
                    product {
                        id
                        name
                        slug
                        featuredAsset {
                            id
                            preview
                        }
                    }
                }
                unitPriceWithTax
                quantity
                linePriceWithTax
            }
            discounts {
                description
                amountWithTax
            }
        }
    }
`);

export const GetProductsSellerNamesQuery = graphql(`
    query GetProductsSellerNames($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                sellerShop {
                    sellerName
                    channelCode
                }
            }
        }
    }
`);

export const GetActiveChannelQuery = graphql(`
    query GetActiveChannel {
        activeChannel {
            id
            code
            defaultLanguageCode
            availableLanguageCodes
            defaultCurrencyCode
            availableCurrencyCodes
        }
    }
`);

export const GetSellerStoreProfileQuery = graphql(`
    query GetSellerStoreProfile {
        storePageProfile {
            storeName
            storeDescription
            storeBannerUrl
            storeHeaderBannerUrl
            socialLinks {
                platform
                username
                dmLink
                profileUrl
                displayName
                inPipeline
            }
        }
    }
`);

export const GetSellerStoreFeaturedProductIdsQuery = graphql(`
    query GetSellerStoreFeaturedProductIds {
        storeFeaturedProductIds
    }
`);

export const GetCollectionProductsQuery = graphql(`
    query GetCollectionProducts($slug: String!, $input: SearchInput!) {
        collection(slug: $slug) {
            id
            name
            slug
            description
            featuredAsset {
                id
                preview
            }
        }
        search(input: $input) {
            totalItems
            items {
                ...ProductCard
            }
        }
    }
`, [ProductCardFragment]);

export const GetWompiSignatureQuery = graphql(`
    query GetWompiSignature($amountInCents: Int!, $paymentReference: String!){
        GetPaymentSignature(amountInCents: $amountInCents, paymentReference: $paymentReference)
    }
    `
)

export const GetProductVariantStockQuery = graphql(`
    query GetProductStock($id: ID!) {
        productVariant(id: $id) {
            id
            stockLevels {
                stockOnHand
                stockAllocated
                stockLocationId
            }
        }
    }
`)

export const GetMySubscriptionQuery = graphql(`
    query GetMySubscription {
        mySubscription {
            id
            status
            startsAt
            endsAt
            autoRenew
            plan {
                id
                name
                price
                billingInterval
                description
            }
            paymentMethodType
            paymentFlowType
            productLimit
            variationLimit
            hasAIAccess
            hasElectronicBilling
        }
    }
`)

export const GetAllPlansQuery = graphql(`
    query GetAllPlans {
        allPlans {
            id
            name
            price
            billingInterval
            description
            planFeatures {
                id
                feature {
                    code
                    name
                    type
                }
                value
            }
        }
    }
`)

export const CheckProductLimitQuery = graphql(`
    query CheckProductLimit {
        checkProductLimit {
            allowed
            current
            limit
        }
    }
`)

export const CheckFeatureAccessQuery = graphql(`
    query CheckFeatureAccess($featureCode: String!) {
        checkFeatureAccess(featureCode: $featureCode)
    }
`)
export const CalculateDeliveryCostQuery = graphql(`
    query CalculateDeliveryCost($input: DeliveryCostInput!) {
        calculateDeliveryCost(input: $input) {
            success
            price {
                value
                currency
            }
            distance {
                value
                unit
                text
            }
            duration {
                value
                unit
                text
            }
            error
        }
    }
`);

export const SavedPaymentMethodsQuery = graphql(`
    query SavedPaymentMethods {
        savedPaymentMethods {
            id
            type
            wompiPaymentSourceId
            lastFour
            brand
            expiryMonth
            expiryYear
            cardHolderName
            isDefault
            createdAt
        }
    }
`);

export const GetWompiTransactionStatusQuery = graphql(`
    query GetWompiTransactionStatus($transactionId: String!) {
        getWompiTransactionStatus(transactionId: $transactionId) {
            id
            status
            statusMessage
            paymentMethodExtra {
                isThreeDs
                threeDsAuth {
                    currentStep
                    currentStepStatus
                    threeDsMethodData
                }
            }
            url
            asyncPaymentUrl
            qrImage
        }
    }
`);
