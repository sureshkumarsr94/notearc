import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';

export const metadata = {
  title: 'NoteArc - Modern Blog',
  description: 'Read our latest articles on technology, design, and lifestyle.',
};

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-10 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-orange-500"></span>
          Welcome to NoteArc
        </div>
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          <span className="block">Discover Stories that</span>
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Ignite Your Creativity</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600 leading-relaxed">
          Insights, tutorials, and stories from the NoteArc team. Explore the latest in technology, design, and digital lifestyle.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
}
