import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PostCardProps {
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    category: string;
    readTime: string;
}

export default function PostCard({ title, excerpt, date, slug, category, readTime }: PostCardProps) {
    return (
        <article className="group flex flex-col space-y-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="rounded-full bg-primary-50 px-2.5 py-0.5 font-medium text-primary-600">
                    {category}
                </span>
                <span>{date}</span>
                <span>•</span>
                <span>{readTime}</span>
            </div>
            <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-primary-600">
                <Link href={`/blog/${slug}`}>
                    {title}
                </Link>
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-gray-500">
                {excerpt}
            </p>
            <div className="pt-2">
                <Link
                    href={`/blog/${slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </article>
    );
}
