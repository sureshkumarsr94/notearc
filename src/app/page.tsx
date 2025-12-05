import { getLatestPosts, getPopularPosts } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import HeroSection from '@/components/home/HeroSection';
import FeaturedPosts from '@/components/home/FeaturedPosts';
import CategoryList from '@/components/home/CategoryList';
import Newsletter from '@/components/home/Newsletter';
import { Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'NoteArc - Modern Blog',
  description: 'Read our latest articles on technology, design, and lifestyle.',
};

export default async function Home() {
  const [latestPosts, popularPosts] = await Promise.all([
    getLatestPosts(6),
    getPopularPosts()
  ]);

  return (
    <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-[30%] -left-[15%] h-[700px] w-[700px] rounded-full bg-orange-100/30 blur-3xl -z-10" />
      <div className="absolute top-[5%] -right-[15%] h-[600px] w-[600px] rounded-full bg-amber-100/40 blur-3xl -z-10" />
      <div className="absolute bottom-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-orange-50/50 blur-3xl -z-10" />

      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto px-4 md:px-6">
        {/* Category Browsing */}
        <CategoryList />

        {/* Featured/Trending Posts */}
        <FeaturedPosts posts={popularPosts} />

        {/* Latest Posts */}
        <section className="py-16 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 mb-4">
                <Clock className="h-4 w-4" />
                <span>Fresh Content</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                Just Published
              </h2>
              <p className="text-gray-500 mt-2">Hot off the press. Catch up on our newest stories.</p>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-100 to-transparent mx-8 mb-2" />
            <Link
              href="/blog"
              className="group hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-all duration-300 px-4 py-2 rounded-full hover:bg-orange-50"
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

          {/* Mobile view all button */}
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              View All Articles
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </div>
    </div>
  );
}
