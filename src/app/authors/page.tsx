import { getAllAuthors } from '@/lib/authors';
import Link from 'next/link';
import AuthorAvatar from '@/components/AuthorAvatar';
import FollowButton from '@/components/FollowButton';
import { Users, Sparkles, Eye, FileText, ArrowRight, Award } from 'lucide-react';

export const metadata = {
    title: 'Authors | NoteArc',
    description: 'Browse all authors on NoteArc - Discover amazing content creators sharing insights and stories.',
};

export default async function AuthorsPage() {
    const authors = await getAllAuthors();

    // Calculate total stats
    const totalPosts = authors.reduce((sum, a) => sum + a.postCount, 0);
    const totalViews = authors.reduce((sum, a) => sum + a.totalViews, 0);

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-orange-100/30 blur-3xl -z-10" />
            <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-3xl -z-10" />
            <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-orange-50/50 blur-3xl -z-10" />

            {/* Hero Header */}
            <header className="relative py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-60" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-orange-600 mb-6 shadow-lg">
                            <Users className="h-4 w-4" />
                            <span>{authors.length} talented creators</span>
                            <Sparkles className="h-4 w-4" />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
                            Meet Our
                            <span className="relative inline-block ml-3">
                                <span className="relative z-10 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">
                                    Authors
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full h-4 text-orange-300" viewBox="0 0 100 12" preserveAspectRatio="none">
                                    <path d="M0 8 Q 25 0, 50 8 T 100 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                            Discover the brilliant minds behind our stories. Follow your favorites and never miss their latest insights.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                            <div className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm px-5 py-3 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100">
                                    <Users className="h-5 w-5 text-orange-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-gray-900">{authors.length}</p>
                                    <p className="text-sm text-gray-500">Authors</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm px-5 py-3 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
                                    <p className="text-sm text-gray-500">Articles</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm px-5 py-3 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100">
                                    <Eye className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Total Views</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Authors Grid */}
            <div className="container mx-auto px-4 md:px-6 pt-8 pb-16">
                {authors.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {authors.map((author, index) => (
                            <article
                                key={author.id}
                                className="group relative animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Glow effect on hover */}
                                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-200 via-amber-100 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

                                <div className="relative flex flex-col h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-orange-200 group-hover:-translate-y-1 overflow-hidden">
                                    {/* Subtle gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative z-10">
                                        {/* Author Header */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <Link href={`/author/${author.slug.trim()}`} className="relative">
                                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                                                <AuthorAvatar
                                                    name={author.name}
                                                    src={author.avatar}
                                                    className="relative h-16 w-16 ring-2 ring-white shadow-md"
                                                />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/author/${author.slug.trim()}`}
                                                    className="block font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors truncate"
                                                >
                                                    {author.display_name}
                                                </Link>
                                                <p className="text-sm text-orange-600 font-medium flex items-center gap-1">
                                                    <Award className="h-3.5 w-3.5" />
                                                    {author.role}
                                                </p>
                                            </div>
                                            <FollowButton authorId={author.id} />
                                        </div>

                                        {/* Bio */}
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px]">
                                            {author.bio || `${author.display_name} is a passionate writer sharing insights and stories on NoteArc.`}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <FileText className="h-4 w-4 text-gray-400" />
                                                <span className="font-semibold text-gray-700">{author.postCount}</span>
                                                <span>posts</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Eye className="h-4 w-4 text-gray-400" />
                                                <span className="font-semibold text-gray-700">{author.totalViews.toLocaleString()}</span>
                                                <span>views</span>
                                            </div>
                                        </div>

                                        {/* View Profile Link */}
                                        <Link
                                            href={`/author/${author.slug.trim()}`}
                                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors"
                                        >
                                            View Profile
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                            <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No authors found</h3>
                        <p className="text-gray-500">Check back later for amazing content creators.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
