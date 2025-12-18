import { getAuthorBySlug } from '@/lib/authors';
import { getPaginatedPostsByAuthor } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Twitter, Linkedin, ChevronLeft, ChevronRight,
    FileText, Eye, Calendar, Clock, Sparkles, ArrowRight, Award, TrendingUp
} from 'lucide-react';
import AuthorAvatar from '@/components/AuthorAvatar';
import FollowButton from '@/components/FollowButton';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const limit = 9;

    const author = await getAuthorBySlug(slug);

    if (!author) {
        notFound();
    }

    const { posts: authorPosts, total } = await getPaginatedPostsByAuthor(slug, currentPage, limit);
    const totalPages = Math.ceil(total / limit);

    // Calculate stats
    const totalViews = authorPosts.reduce((acc, post) => acc + (post.views || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-orange-100/30 blur-3xl -z-10" />
            <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-3xl -z-10" />
            <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-orange-50/50 blur-3xl -z-10" />

            {/* Hero Section */}
            <header className="relative py-12 md:py-20 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-50" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    {/* Back Link */}
                    <Link
                        href="/authors"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        All Authors
                    </Link>

                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                            {/* Avatar with Glow */}
                            <div className="relative">
                                <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 opacity-75 blur-xl" />
                                <div className="relative h-36 w-36 md:h-44 md:w-44 rounded-full border-4 border-white shadow-2xl overflow-hidden">
                                    <AuthorAvatar
                                        name={author.name}
                                        src={author.avatar}
                                        className="h-full w-full text-5xl"
                                    />
                                </div>
                                {/* Verified Badge */}
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full p-2 shadow-lg">
                                    <Award className="h-5 w-5 text-white" />
                                </div>
                            </div>

                            {/* Author Info */}
                            <div className="flex-1">
                                {/* Role Badge */}
                                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-orange-600 mb-4 shadow-lg">
                                    <Sparkles className="h-4 w-4" />
                                    <span>{author.role}</span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    {author.display_name}
                                </h1>

                                <p className="text-lg text-gray-600 max-w-2xl mb-6">
                                    {author.bio || `${author.display_name} is a passionate writer sharing insights and stories on NoteArc.`}
                                </p>

                                {/* Stats Row */}
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                                    <div className="flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur-sm px-4 py-2 shadow-md border border-gray-100">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
                                            <FileText className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-lg font-bold text-gray-900">{total}</p>
                                            <p className="text-xs text-gray-500">Articles</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur-sm px-4 py-2 shadow-md border border-gray-100">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                                            <Eye className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-lg font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">Views</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Row */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <FollowButton authorId={author.id} />

                                    {/* Social Links */}
                                    <div className="flex items-center gap-2">
                                        {author.social_twitter && (
                                            <a
                                                href={author.social_twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-gray-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-all duration-300"
                                            >
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                        )}
                                        {author.social_linkedin && (
                                            <a
                                                href={author.social_linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-gray-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-all duration-300"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Articles Section */}
            <div className="container mx-auto px-4 py-12 md:px-6 max-w-6xl">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>Latest Articles</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />
                    <span className="text-sm text-gray-500">{total} articles</span>
                </div>

                {authorPosts.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                            {authorPosts.map((post, index) => (
                                <article
                                    key={post.slug}
                                    className="group relative animate-fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Glow effect on hover */}
                                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-200 via-amber-100 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="block relative h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-orange-200 group-hover:-translate-y-1 overflow-hidden"
                                    >
                                        {/* Subtle gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative z-10 flex flex-col h-full">
                                            {/* Category & Date */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-xs font-semibold text-orange-700 uppercase tracking-wide">
                                                    {post.category}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
                                                {post.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                                                {post.excerpt}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {post.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {post.readTime}
                                                    </span>
                                                </div>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    {(post.views || 0).toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Read More Arrow */}
                                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white shadow-lg">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3">
                                {currentPage > 1 && (
                                    <Link
                                        href={`/author/${slug}?page=${currentPage - 1}`}
                                        className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-md border border-gray-100 hover:border-orange-200 hover:text-orange-600 transition-all duration-300"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Link>
                                )}
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <Link
                                            key={pageNum}
                                            href={`/author/${slug}?page=${pageNum}`}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${pageNum === currentPage
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                                : 'bg-white text-gray-600 shadow-md border border-gray-100 hover:border-orange-200 hover:text-orange-600'
                                                }`}
                                        >
                                            {pageNum}
                                        </Link>
                                    ))}
                                </div>
                                {currentPage < totalPages && (
                                    <Link
                                        href={`/author/${slug}?page=${currentPage + 1}`}
                                        className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-md border border-gray-100 hover:border-orange-200 hover:text-orange-600 transition-all duration-300"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 blur-xl opacity-30" />
                            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100">
                                <FileText className="h-10 w-10 text-orange-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                            No Articles Yet
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            {author.display_name} hasn't published any articles yet. Check back soon!
                        </p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <Sparkles className="h-4 w-4" />
                            Browse All Articles
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
