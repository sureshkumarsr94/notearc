import { getPaginatedPosts } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Blog | NoteArc',
    description: 'Explore all our articles on technology, design, and lifestyle.',
};

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = 9;
    const { posts, total } = await getPaginatedPosts(page, limit);
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-orange-100/30 blur-3xl -z-10" />
            <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-3xl -z-10" />
            <div className="absolute bottom-[10%] right-[5%] h-[400px] w-[400px] rounded-full bg-orange-50/50 blur-3xl -z-10" />

            {/* Hero Header */}
            <header className="relative py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-60" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-orange-600 mb-6 shadow-lg">
                            <BookOpen className="h-4 w-4" />
                            <span>{total} articles and counting</span>
                            <Sparkles className="h-4 w-4" />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
                            Explore Our
                            <span className="relative inline-block ml-3">
                                <span className="relative z-10 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">
                                    Stories
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full h-4 text-orange-300" viewBox="0 0 100 12" preserveAspectRatio="none">
                                    <path d="M0 8 Q 25 0, 50 8 T 100 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Dive into our complete collection of insights, ideas, and inspiration for curious minds.
                        </p>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 pt-8 pb-16">
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
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                        <p className="text-gray-500 mb-6">Try selecting a different category or check back later.</p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                        >
                            View all articles
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav className="flex justify-center items-center gap-2" aria-label="Blog pagination">
                        {/* Previous Button */}
                        {page > 1 ? (
                            <Link
                                href={`/blog?page=${page - 1}`}
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
                                // Show first, last, current and adjacent pages
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
                                        href={`/blog?page=${pageNum}`}
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
                                href={`/blog?page=${page + 1}`}
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
