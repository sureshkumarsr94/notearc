import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Tag, Eye, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import ViewCounter from '@/components/blog/ViewCounter';
import AuthorAvatar from '@/components/AuthorAvatar';
import FollowButton from '@/components/FollowButton';
import SaveButton from '@/components/SaveButton';
import BackButton from '@/components/BackButton';

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

    // Fetch related posts
    let relatedPosts: any[] = [];
    try {
        relatedPosts = await getRelatedPosts(slug, post.category, 3);
    } catch (e) {
        // Related posts are optional
    }

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-orange-100/30 blur-3xl -z-10" />
            <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-3xl -z-10" />
            <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-orange-50/50 blur-3xl -z-10" />

            {/* Hero Header */}
            <header className="relative py-12 md:py-16 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-40" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <BackButton fallbackUrl="/blog" label="Go Back" />

                        {/* Category & Meta */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href={`/topic/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Tag className="h-3.5 w-3.5" />
                                    {post.category}
                                </Link>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {post.readTime}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Eye className="h-4 w-4" />
                                        {post.views?.toLocaleString() || 0} views
                                    </span>
                                </div>
                            </div>
                            <SaveButton postSlug={post.slug} />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                            {post.title}
                        </h1>
                    </div>
                </div>
            </header>


            {/* View Counter (hidden) */}
            <ViewCounter slug={post.slug} />

            {/* Article Content */}
            <article className="container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
                        <BookOpen className="h-6 w-6 text-orange-400" />
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg prose-orange mx-auto 
                        prose-headings:font-bold prose-headings:tracking-tight
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-gray-900
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800
                        prose-p:text-gray-600 prose-p:leading-8 prose-p:mb-6
                        prose-li:text-gray-600 prose-li:mb-2
                        prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                        prose-img:rounded-xl prose-img:shadow-lg"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Bottom divider */}
                    <div className="flex items-center gap-4 mt-16 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                        <Sparkles className="h-5 w-5 text-orange-400" />
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    </div>

                    {/* Author Bio Card */}
                    {post.author && (
                        <div className="relative rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 p-8 border border-orange-100 mb-12">
                            <div className="absolute -top-5 left-8">
                                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                                    <Sparkles className="h-4 w-4" />
                                    Written by
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-4">
                                <Link href={`/author/${post.author.slug.trim()}`} className="relative group">
                                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 opacity-50 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                                    <div className="relative h-20 w-20 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                                        <AuthorAvatar
                                            name={post.author.name}
                                            src={post.author.avatar}
                                            className="h-full w-full text-xl"
                                        />
                                    </div>
                                </Link>
                                <div className="flex-1 text-center sm:text-left">
                                    <Link
                                        href={`/author/${post.author.slug.trim()}`}
                                        className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
                                    >
                                        {post.author.name}
                                    </Link>
                                    <p className="text-orange-600 font-medium mb-2">{post.author.role}</p>
                                    <p className="text-gray-600 mb-4">
                                        {(post.author as any)?.bio || `${post.author.name} is a passionate writer sharing insights and stories on NoteArc.`}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                        <FollowButton authorId={post.author.id} />
                                        <Link
                                            href={`/author/${post.author.slug.trim()}`}
                                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-md border border-gray-200 hover:border-orange-200 hover:text-orange-600 transition-all duration-300"
                                        >
                                            View Profile
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="container mx-auto px-4 md:px-6 pb-16">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-10">
                            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600">
                                <BookOpen className="h-4 w-4" />
                                <span>Related Articles</span>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {relatedPosts.map((relatedPost, index) => (
                                <article
                                    key={relatedPost.slug}
                                    className="group relative animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-200 via-amber-100 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

                                    <Link
                                        href={`/blog/${relatedPost.slug}`}
                                        className="block relative h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-orange-200 group-hover:-translate-y-1 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative z-10">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-xs font-semibold text-orange-700 uppercase tracking-wide mb-4">
                                                {relatedPost.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                {relatedPost.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {relatedPost.readTime}
                                                </span>
                                                <span className="flex items-center gap-1 text-orange-600 font-medium group-hover:gap-2 transition-all">
                                                    Read more
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
                            '@type': 'Person',
                            name: post.author?.name || 'NoteArc',
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
        </div>
    );
}
