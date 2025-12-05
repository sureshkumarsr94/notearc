import Link from 'next/link';
import { ArrowRight, Clock, Eye, Calendar } from 'lucide-react';

interface PostCardProps {
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    category: string;
    readTime: string;
    views?: number;
}

export default function PostCard({ title, excerpt, date, slug, category, readTime, views = 0 }: PostCardProps) {
    return (
        <article className="group relative h-full">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-200 via-amber-100 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

            <div className="relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-orange-200 group-hover:-translate-y-1 overflow-hidden">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            {readTime}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1">
                            <Eye className="h-3 w-3 text-gray-400" />
                            {views}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-3">
                        <Link href={`/blog/${slug}`} className="hover:underline decoration-orange-300 underline-offset-4">
                            {title}
                        </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3 mb-4">
                        {excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <span className="rounded-full bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1.5 text-xs font-semibold text-orange-600 border border-orange-100">
                            {category}
                        </span>

                        <Link
                            href={`/blog/${slug}`}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors duration-300"
                            aria-label={`Read more about ${title}`}
                        >
                            Read more
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}

