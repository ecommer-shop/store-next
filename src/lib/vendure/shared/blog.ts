import { graphql } from '@/graphql';

export const BlogPostCardFragment = graphql(`
    fragment BlogPostCard on BlogPost {
        id
        slug
        title
        excerpt
        publishedAt
        readingTimeMinutes
        featuredImage {
            id
            preview
        }
        author {
            id
            firstName
            lastName
        }
        categories {
            id
            name
            slug
        }
        tags {
            id
            name
            slug
        }
    }
`);

export const GetBlogPostsQuery = graphql(`
    query GetBlogPosts($options: BlogPostListOptions, $languageCode: LanguageCode) {
        blogPosts(options: $options, languageCode: $languageCode) {
            items {
                ...BlogPostCard
            }
            totalItems
        }
    }
`, [BlogPostCardFragment]);

export const GetBlogPostBySlugQuery = graphql(`
    query GetBlogPostBySlug($slug: String!, $languageCode: LanguageCode) {
        blogPost(slug: $slug, languageCode: $languageCode) {
            id
            slug
            title
            content
            excerpt
            publishedAt
            readingTimeMinutes
            canonicalUrl
            structuredData
            featuredImage {
                id
                preview
            }
            ogImage {
                id
                preview
            }
            author {
                id
                firstName
                lastName
            }
            categories {
                id
                name
                slug
            }
            tags {
                id
                name
                slug
            }
            relatedProducts {
                id
                name
                slug
                featuredAsset {
                    id
                    preview
                }
            }
            relatedPosts {
                id
                slug
                title
                featuredImage {
                    id
                    preview
                }
            }
        }
    }
`);

export const GetBlogCategoriesQuery = graphql(`
    query GetBlogCategories($languageCode: LanguageCode) {
        blogCategories(languageCode: $languageCode) {
            id
            name
            slug
        }
    }
`);

export const GetBlogPostsByCategoryQuery = graphql(`
    query GetBlogPostsByCategory($categorySlug: String!, $options: BlogPostListOptions) {
        blogPostsByCategory(categorySlug: $categorySlug, options: $options) {
            items {
                ...BlogPostCard
            }
            totalItems
        }
    }
`, [BlogPostCardFragment]);

export const GetBlogPostsByTagQuery = graphql(`
    query GetBlogPostsByTag($tagSlug: String!, $options: BlogPostListOptions) {
        blogPostsByTag(tagSlug: $tagSlug, options: $options) {
            items {
                ...BlogPostCard
            }
            totalItems
        }
    }
`, [BlogPostCardFragment]);
