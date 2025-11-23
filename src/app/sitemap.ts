import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.notearc.info';
    const currentDate = new Date().toISOString();

    // Static routes that always exist
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-conditions`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    try {
        const posts = await getAllPosts();

        // Generate sitemap entries for all blog posts
        const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        return [...staticRoutes, ...blogPosts];
    } catch (error) {
        console.error('Error fetching posts for sitemap:', error);
        // Return static routes only if database fails
        return staticRoutes;
    }
}
