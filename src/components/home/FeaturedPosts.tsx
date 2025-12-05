import { Flame, ArrowUpRight, Eye, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Post {
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    category: string;
    readTime: string;
    views?: number;
    image?: string;
}

interface FeaturedPostsProps {
    posts: Post[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
    if (posts.length === 0) return null;

    const featuredPost = posts[0];
    const secondaryPosts = posts.slice(1, 4);

    return (
        <section className="py-16 md:py-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600 mb-4">
                        <Flame className="h-4 w-4 fill-current" />
                        <span>Trending Now</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Must-Read Stories
                    </h2>
                    <p className="text-gray-500 mt-2">The articles sparking the most conversations right now.</p>
                </div>
                <Link
                    href="/blog"
                    className="group hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-all duration-300 px-4 py-2 rounded-full hover:bg-orange-50"
                >
                    View all articles
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Featured Post - Large */}
                <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group relative block rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-1 shadow-xl shadow-orange-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-1"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/50 via-transparent to-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative rounded-[20px] bg-white p-8 h-full min-h-[360px] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-600">
                                    #1 Trending
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="h-3.5 w-3.5" />
                                    {featuredPost.views || 0} views
                                </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-4 leading-tight">
                                {featuredPost.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed line-clamp-3 text-lg">
                                {featuredPost.excerpt}
                            </p>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {featuredPost.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {featuredPost.readTime}
                                </span>
                            </div>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                {featuredPost.category}
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Secondary Posts */}
                <div className="flex flex-col gap-6">
                    {secondaryPosts.map((post, index) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex gap-6 rounded-2xl bg-white p-5 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-orange-200 hover:-translate-y-0.5"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 text-xl font-bold text-orange-600 font-mono">
                                {index + 2}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                                        {post.category}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {post.views || 0}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2 leading-snug">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
