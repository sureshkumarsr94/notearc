import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const posts = await getAllPosts();
        const baseUrl = 'https://www.notearc.info';
        const currentDate = new Date().toISOString();

        // Generate sitemap entries for all blog posts
        const blogPosts = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [
            {
                url: baseUrl,
                lastModified: currentDate,
                changeFrequency: 'daily' as const,
                priority: 1,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: currentDate,
                changeFrequency: 'daily' as const,
                priority: 0.9,
            },
            {
                url: `${baseUrl}/privacy-policy`,
                lastModified: currentDate,
                changeFrequency: 'monthly' as const,
                priority: 0.3,
            },
            {
                url: `${baseUrl}/terms-conditions`,
                lastModified: currentDate,
                changeFrequency: 'monthly' as const,
                priority: 0.3,
            },
            ...blogPosts,
        ];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return [];
    }
}
