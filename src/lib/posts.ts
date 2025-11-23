import pool from './db';
import { RowDataPacket } from 'mysql2';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  views: number;
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT slug, title, excerpt, date, readTime, category, content, views FROM posts');
    const posts = rows as unknown as Post[];
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT slug, title, excerpt, date, readTime, category, content, views FROM posts WHERE slug = ?', [slug]);
    if (rows.length === 0) return undefined;
    return rows[0] as unknown as Post;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return undefined;
  }
}

export async function incrementViewCount(slug: string): Promise<void> {
  try {
    await pool.query('UPDATE posts SET views = views + 1 WHERE slug = ?', [slug]);
  } catch (error) {
    console.error(`Error incrementing view count for slug ${slug}:`, error);
  }
}

export async function getPopularPosts(): Promise<Post[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT slug, title, excerpt, date, readTime, category, content, views FROM posts ORDER BY views DESC LIMIT 4');
    return rows as unknown as Post[];
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }
}

export async function getLatestPosts(limit: number): Promise<Post[]> {
  try {
    // Exclude content for lighter query, fetch all to sort by date correctly in JS
    const [rows] = await pool.query<RowDataPacket[]>('SELECT slug, title, excerpt, date, readTime, category, views FROM posts');
    const posts = rows as unknown as Post[];
    return posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

export async function getPaginatedPosts(page: number, limit: number): Promise<{ posts: Post[], total: number }> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT slug, title, excerpt, date, readTime, category, views FROM posts');
    const allPosts = rows as unknown as Post[];
    const sortedPosts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      total: allPosts.length
    };
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    return { posts: [], total: 0 };
  }
}

export async function searchPosts(query: string): Promise<Post[]> {
  try {
    const searchTerm = `%${query}%`;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT slug, title, excerpt, date, readTime, category, views FROM posts WHERE title LIKE ? OR content LIKE ? OR excerpt LIKE ?',
      [searchTerm, searchTerm, searchTerm]
    );
    return rows as unknown as Post[];
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}
