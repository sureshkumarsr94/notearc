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
        <article className="group flex h-full flex-col space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {date}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readTime}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {views} views
                </span>
            </div>

            <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-primary-600">
                <Link href={`/blog/${slug}`}>
                    {title}
                </Link>
            </h3>

            <p className="flex-1 text-sm leading-relaxed text-gray-500 line-clamp-4">
                {excerpt}
            </p>

            <div className="flex items-center justify-between pt-2">
                <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600">
                    {category}
                </span>

                <Link
                    href={`/blog/${slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                    aria-label={`Read more about ${title}`}
                >
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </article>
    );
}
