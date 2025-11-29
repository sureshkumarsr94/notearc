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
  author?: {
    id: number;
    name: string;
    slug: string;
    avatar: string;
    role: string;
  };
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const query = `
      SELECT p.slug, p.title, p.excerpt, p.date, p.readTime, p.category, p.content, p.views,
             a.id as author_id, a.name as author_name, a.slug as author_slug, a.image as author_avatar, a.role as author_role
      FROM posts p
      LEFT JOIN users a ON p.author_id = a.id
    `;
    interface PostRow extends RowDataPacket {
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      category: string;
      content: string;
      views: number;
      author_id: number | null;
      author_name: string | null;
      author_slug: string | null;
      author_avatar: string | null;
      author_role: string | null;
    }

    const [rows] = await pool.query<PostRow[]>(query);
    const posts = rows.map((row) => ({
      ...row,
      author: row.author_name ? {
        id: row.author_id!,
        name: row.author_name,
        slug: row.author_slug!,
        avatar: row.author_avatar!,
        role: row.author_role!
      } : undefined
    })) as Post[];
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const query = `
      SELECT p.slug, p.title, p.excerpt, p.date, p.readTime, p.category, p.content, p.views,
             a.id as author_id, a.name as author_name, a.slug as author_slug, a.image as author_avatar, a.role as author_role
      FROM posts p
      LEFT JOIN users a ON p.author_id = a.id
      WHERE p.slug = ?
    `;
    interface PostRow extends RowDataPacket {
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      category: string;
      content: string;
      views: number;
      author_id: number | null;
      author_name: string | null;
      author_slug: string | null;
      author_avatar: string | null;
      author_role: string | null;
    }

    const [rows] = await pool.query<PostRow[]>(query, [slug]);
    if (rows.length === 0) return undefined;

    const row = rows[0];
    return {
      ...row,
      author: row.author_name ? {
        id: row.author_id!,
        name: row.author_name,
        slug: row.author_slug!,
        avatar: row.author_avatar!,
        role: row.author_role!
      } : undefined
    } as Post;
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
export async function getPaginatedPostsByAuthor(authorSlug: string, page: number, limit: number): Promise<{ posts: Post[], total: number }> {
  try {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM posts p
      JOIN users a ON p.author_id = a.id
      WHERE a.slug = ?
    `;
    const [countRows] = await pool.query<RowDataPacket[]>(countQuery, [authorSlug]);
    const total = countRows[0].total;

    // Get paginated posts
    const query = `
      SELECT p.slug, p.title, p.excerpt, p.date, p.readTime, p.category, p.content, p.views,
             a.id as author_id, a.name as author_name, a.slug as author_slug, a.image as author_avatar, a.role as author_role
      FROM posts p
      JOIN users a ON p.author_id = a.id
      WHERE a.slug = ?
      ORDER BY p.date DESC
      LIMIT ? OFFSET ?
    `;

    interface PostRow extends RowDataPacket {
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      category: string;
      content: string;
      views: number;
      author_id: number | null;
      author_name: string | null;
      author_slug: string | null;
      author_avatar: string | null;
      author_role: string | null;
    }

    const [rows] = await pool.query<PostRow[]>(query, [authorSlug, limit, offset]);
    const posts = rows.map((row) => ({
      ...row,
      author: row.author_name ? {
        id: row.author_id!,
        name: row.author_name,
        slug: row.author_slug!,
        avatar: row.author_avatar!,
        role: row.author_role!
      } : undefined
    })) as Post[];

    return { posts, total };
  } catch (error) {
    console.error(`Error fetching paginated posts for author ${authorSlug}:`, error);
    return { posts: [], total: 0 };
  }
}
