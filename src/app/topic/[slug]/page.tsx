import { getPostsByCategory, getAllCategories } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Hash, Sparkles, ArrowLeft, FileText } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Category metadata with icons and colors
const categoryMeta: Record<string, { icon: string, color: string, description: string }> = {
    'personal-development': {
        icon: '💡',
        color: 'from-violet-500 to-purple-600',
        description: 'Unlock your potential with insights on growth, mindset, and self-improvement.'
    },
    'communication': {
        icon: '💬',
        color: 'from-blue-500 to-cyan-500',
        description: 'Master the art of connection through effective communication strategies.'
    },
    'productivity': {
        icon: '🎯',
        color: 'from-green-500 to-emerald-600',
        description: 'Optimize your workflow and achieve more with less effort.'
    },
    'finance': {
        icon: '💰',
        color: 'from-amber-500 to-orange-600',
        description: 'Build financial wisdom and take control of your money journey.'
    },
    'lifestyle': {
        icon: '❤️',
        color: 'from-pink-500 to-rose-600',
        description: 'Curate a life you love with tips on wellness, habits, and living well.'
    },
    'career': {
        icon: '💼',
        color: 'from-slate-600 to-gray-700',
        description: 'Navigate your professional path with career insights and guidance.'
    },
    'learning': {
        icon: '📚',
        color: 'from-indigo-500 to-blue-600',
        description: 'Embrace lifelong learning with resources and strategies to grow.'
    },
    'motivation': {
        icon: '⚡',
        color: 'from-yellow-500 to-orange-500',
        description: 'Find your drive and stay inspired with motivational content.'
    },
    'relationships': {
        icon: '👥',
        color: 'from-red-500 to-pink-600',
        description: 'Nurture meaningful connections and build stronger bonds.'
    },
};

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const categoryName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const meta = categoryMeta[slug];

    return {
        title: `${categoryName} Articles | NoteArc`,
        description: meta?.description || `Browse all ${categoryName} articles on NoteArc`,
    };
}

export default async function TopicPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;
    const limit = 9;

    const { posts, total } = await getPostsByCategory(slug, page, limit);
    const allCategories = await getAllCategories();
    const totalPages = Math.ceil(total / limit);

    const categoryName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const meta = categoryMeta[slug] || {
        icon: '📝',
        color: 'from-orange-500 to-amber-500',
        description: `Explore ${categoryName} articles and insights.`
    };

    // If no posts and not the first page, show not found
    if (posts.length === 0 && page > 1) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-orange-100/30 blur-3xl -z-10" />
            <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-3xl -z-10" />
            <div className="absolute bottom-[10%] right-[5%] h-[400px] w-[400px] rounded-full bg-orange-50/50 blur-3xl -z-10" />

            {/* Hero Header */}
            <header className="relative py-12 md:py-16 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-60" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>

                    <div className="max-w-3xl">
                        {/* Category Badge */}
                        <div className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${meta.color} px-4 py-2 text-white shadow-lg mb-6`}>
                            <span className="text-xl">{meta.icon}</span>
                            <Hash className="h-4 w-4" />
                            <span className="font-semibold">{categoryName}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                            {categoryName}
                            <span className="ml-3 inline-flex items-center">
                                <Sparkles className="h-8 w-8 text-orange-400" />
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-6">
                            {meta.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 shadow border border-gray-100">
                                <FileText className="h-4 w-4 text-orange-500" />
                                <span className="font-semibold text-gray-900">{total}</span>
                                <span>articles</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 pb-16">
                {/* Other Categories */}
                <div className="mb-10">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                        More Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {allCategories
                            .filter(cat => cat.slug !== slug)
                            .slice(0, 6)
                            .map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/topic/${category.slug}`}
                                    className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600 hover:shadow-md transition-all duration-300"
                                >
                                    {category.name}
                                    <span className="ml-2 text-gray-400">({category.count})</span>
                                </Link>
                            ))}
                    </div>
                </div>

                {/* Posts Grid */}
                {posts.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
                        {posts.map((post, index) => (
                            <div
                                key={post.slug}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
                        <p className="text-gray-500 mb-6">Check back later for {categoryName} content.</p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                        >
                            Browse all articles
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav className="flex justify-center items-center gap-2" aria-label="Topic pagination">
                        {/* Previous Button */}
                        {page > 1 ? (
                            <Link
                                href={`/topic/${slug}?page=${page - 1}`}
                                className="group flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5"
                            >
                                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Previous
                            </Link>
                        ) : (
                            <span className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-400 cursor-not-allowed">
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </span>
                        )}

                        {/* Page Numbers */}
                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                const showPage = pageNum === 1 ||
                                    pageNum === totalPages ||
                                    Math.abs(pageNum - page) <= 1;
                                const showEllipsis = pageNum === 2 && page > 3 ||
                                    pageNum === totalPages - 1 && page < totalPages - 2;

                                if (!showPage && !showEllipsis) return null;

                                if (showEllipsis && !showPage) {
                                    return (
                                        <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <Link
                                        key={pageNum}
                                        href={`/topic/${slug}?page=${pageNum}`}
                                        className={`flex items-center justify-center h-10 w-10 rounded-xl text-sm font-medium transition-all duration-300 ${pageNum === page
                                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                                                : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600'
                                            }`}
                                    >
                                        {pageNum}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Page Indicator */}
                        <span className="sm:hidden flex items-center rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600">
                            {page} / {totalPages}
                        </span>

                        {/* Next Button */}
                        {page < totalPages ? (
                            <Link
                                href={`/topic/${slug}?page=${page + 1}`}
                                className="group flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        ) : (
                            <span className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-400 cursor-not-allowed">
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </span>
                        )}
                    </nav>
                )}
            </div>
        </div>
    );
}
