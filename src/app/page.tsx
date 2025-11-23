import { getLatestPosts, getPopularPosts } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import { Flame, Clock, Sparkles, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'NoteArc - Modern Blog',
  description: 'Read our latest articles on technology, design, and lifestyle.',
};

export default async function Home() {
  const [latestPosts, popularPosts] = await Promise.all([
    getLatestPosts(9),
    getPopularPosts()
  ]);

  return (
    <div className="min-h-screen bg-gray-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-orange-100/40 blur-3xl -z-10" />
      <div className="absolute top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-12 md:px-6">

        {/* Minimal Intro Header */}
        <header className="mb-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-orange-600 shadow-sm backdrop-blur-sm mb-6 border border-orange-100">
            <Sparkles className="h-3 w-3" />
            <span>Curated for curious minds</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6 leading-tight">
            Explore the <span className="relative inline-block text-orange-600">
              Unseen
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>.
          </h1>
        </header>

        {/* Popular Posts - Highlighted Section */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Flame className="h-6 w-6 text-orange-500 fill-orange-500" />
                Trending Now
              </h2>
              <p className="text-gray-500">Stories that are sparking conversations.</p>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gray-200 mx-8 mb-2"></div>
            <Link
              href="/blog"
              className="group hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-all duration-300 mb-1 px-4 py-2 rounded-full hover:bg-orange-50"
            >
              View all
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {popularPosts.map((post, index) => (
              <div key={`popular-${post.slug}`} className="relative group">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-orange-100 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                <div className="absolute -top-4 -left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-orange-100 shadow-md text-lg font-bold text-orange-600 font-mono">
                  {index + 1}
                </div>
                <PostCard {...post} />
              </div>
            ))}
          </div>
        </section>

        {/* Latest Posts */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Clock className="h-6 w-6 text-blue-500" />
                Just Published
              </h2>
              <p className="text-gray-500">Fresh off the press. Read the latest.</p>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gray-200 mx-8 mb-2"></div>
            <Link
              href="/blog"
              className="group hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 mb-1 px-4 py-2 rounded-full hover:bg-blue-50"
            >
              View all
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={`latest-${post.slug}`} {...post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
