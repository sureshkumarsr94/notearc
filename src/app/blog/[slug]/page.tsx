import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import ViewCounter from '@/components/blog/ViewCounter';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const siteUrl = 'https://www.notearc.info';
    const postUrl = `${siteUrl}/blog/${post.slug}`;

    return {
        title: `${post.title} | NoteArc`,
        description: post.excerpt,
        keywords: [
            post.category,
            'blog',
            'personal development',
            'self improvement',
            post.title.split(':')[0],
        ].join(', '),
        authors: [{ name: 'NoteArc Team' }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: postUrl,
            siteName: 'NoteArc',
            locale: 'en_US',
            type: 'article',
            publishedTime: new Date(post.date).toISOString(),
            authors: ['NoteArc Team'],
            tags: [post.category],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            creator: '@notearc',
        },
        alternates: {
            canonical: postUrl,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="container mx-auto px-4 py-16 md:px-6">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                </Link>

                <header className="mb-10">
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 font-medium text-primary-700">
                            <Tag className="h-3 w-3" />
                            {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                            {post.views} views
                        </span>
                    </div>
                    <ViewCounter slug={post.slug} />
                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        {post.title}
                    </h1>
                    <p className="text-xl leading-relaxed text-gray-600">
                        {post.excerpt}
                    </p>
                </header>

                <div className="prose prose-lg prose-orange mx-auto prose-headings:mt-10 prose-headings:mb-5 prose-p:mb-8 prose-p:leading-8 prose-li:mb-2">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
            </div>

            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: post.title,
                        description: post.excerpt,
                        author: {
                            '@type': 'Organization',
                            name: 'NoteArc',
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'NoteArc',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://www.notearc.info/logo.png',
                            },
                        },
                        datePublished: new Date(post.date).toISOString(),
                        dateModified: new Date(post.date).toISOString(),
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `https://www.notearc.info/blog/${post.slug}`,
                        },
                        articleSection: post.category,
                        keywords: post.category,
                    }),
                }}
            />
        </article>
    );
}
