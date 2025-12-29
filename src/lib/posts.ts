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
  image?: string;
  author?: {
    id: number;
    name: string;
    slug: string;
    avatar: string;
    role: string;
    bio?: string | null;
  };
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const query = `
      SELECT p.slug, p.title, p.excerpt, p.date, p.readTime, p.category, p.content, p.views, p.image,
             a.id as author_id, a.name as author_name, COALESCE(a.alias_name, a.name) as author_display_name, a.slug as author_slug, a.image as author_avatar, a.role as author_role, a.bio as author_bio
      FROM posts p
      LEFT JOIN users a ON p.author_id = a.id
      WHERE p.status = 'published' OR p.status IS NULL
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
      image: string | null;
      author_id: number | null;
      author_name: string | null;
      author_display_name: string | null;
      author_slug: string | null;
      author_avatar: string | null;
      author_role: string | null;
      author_bio: string | null;
    }

    const [rows] = await pool.query<PostRow[]>(query);
    const posts = rows.map((row) => ({
      ...row,
      author: row.author_name ? {
        id: row.author_id!,
        name: row.author_display_name || row.author_name,
        slug: row.author_slug!,
        avatar: row.author_avatar!,
        role: row.author_role!,
        bio: row.author_bio
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
      SELECT p.slug, p.title, p.excerpt, p.date, p.readTime, p.category, p.content, p.views, p.image,
             a.id as author_id, a.name as author_name, COALESCE(a.alias_name, a.name) as author_display_name, a.slug as author_slug, a.image as author_avatar, a.role as author_role, a.bio as author_bio
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
      image: string | null;
      author_id: number | null;
      author_name: string | null;
      author_display_name: string | null;
      author_slug: string | null;
      author_avatar: string | null;
      author_role: string | null;
      author_bio: string | null;
    }

    const [rows] = await pool.query<PostRow[]>(query, [slug]);
    if (rows.length === 0) return undefined;

    const row = rows[0];
    return {
      ...row,
      author: row.author_name ? {
        id: row.author_id!,
        name: row.author_display_name || row.author_name,
        slug: row.author_slug!,
        avatar: row.author_avatar!,
        role: row.author_role!,
        bio: row.author_bio
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
    const [rows] = await pool.query<RowDataPacket[]>('SELECT slug, title, excerpt, date, readTime, category, content, views, image FROM posts ORDER BY views DESC LIMIT 4');
    return rows as unknown as Post[];
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }
}

export async function getLatestPosts(limit: number): Promise<Post[]> {
  try {
    // Exclude content for lighter query, fetch all to sort by date correctly in JS
    const [rows] = await pool.query<RowDataPacket[]>('SELECT slug, title, excerpt, date, readTime, category, views, image FROM posts');
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
    const [rows] = await pool.query<RowDataPacket[]>('SELECT slug, title, excerpt, date, readTime, category, views, image FROM posts');
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
      'SELECT slug, title, excerpt, date, readTime, category, views, image FROM posts WHERE title LIKE ? OR content LIKE ? OR excerpt LIKE ?',
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
      SELECT p.slug, p.title, p.excerpt, p.date, p.readTime, p.category, p.content, p.views, p.image,
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
      image: string | null;
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

export async function getPostsByCategory(categorySlug: string, page: number = 1, limit: number = 9): Promise<{ posts: Post[], total: number }> {
  try {
    // Convert slug to category name (e.g., "personal-development" -> "Personal Development")
    const categoryName = categorySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Get total count
    const [countRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM posts WHERE category = ?',
      [categoryName]
    );
    const total = countRows[0].total;

    // Get paginated posts
    const offset = (page - 1) * limit;
    const query = `
      SELECT p.slug, p.title, p.excerpt, p.date, p.readTime, p.category, p.views, p.image,
             a.id as author_id, a.name as author_name, a.slug as author_slug, a.image as author_avatar, a.role as author_role
      FROM posts p
      LEFT JOIN users a ON p.author_id = a.id
      WHERE p.category = ?
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
      views: number;
      image: string | null;
      author_id: number | null;
      author_name: string | null;
      author_slug: string | null;
      author_avatar: string | null;
      author_role: string | null;
    }

    const [rows] = await pool.query<PostRow[]>(query, [categoryName, limit, offset]);
    const posts = rows.map((row) => ({
      ...row,
      content: '', // Not needed for listing
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
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    return { posts: [], total: 0 };
  }
}

export async function getAllCategories(): Promise<{ name: string, slug: string, count: number }[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT category, COUNT(*) as count FROM posts GROUP BY category ORDER BY count DESC'
    );

    return rows.map((row: RowDataPacket) => ({
      name: row.category as string,
      slug: (row.category as string).toLowerCase().replace(/\s+/g, '-'),
      count: row.count as number
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getRelatedPosts(currentSlug: string, category: string, limit: number = 3): Promise<Post[]> {
  try {
    const query = `
      SELECT p.slug, p.title, p.excerpt, p.date, p.readTime, p.category, p.views, p.image,
             a.id as author_id, a.name as author_name, a.slug as author_slug, a.image as author_avatar, a.role as author_role
      FROM posts p
      LEFT JOIN users a ON p.author_id = a.id
      WHERE p.category = ? AND p.slug != ?
      ORDER BY p.views DESC
      LIMIT ?
    `;

    interface PostRow extends RowDataPacket {
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      category: string;
      views: number;
      image: string | null;
      author_id: number | null;
      author_name: string | null;
      author_slug: string | null;
      author_avatar: string | null;
      author_role: string | null;
    }

    const [rows] = await pool.query<PostRow[]>(query, [category, currentSlug, limit]);
    const posts = rows.map((row) => ({
      ...row,
      content: '', // Not needed for related posts
      author: row.author_name ? {
        id: row.author_id!,
        name: row.author_name,
        slug: row.author_slug!,
        avatar: row.author_avatar!,
        role: row.author_role!
      } : undefined
    })) as Post[];

    return posts;
  } catch (error) {
    console.error(`Error fetching related posts for ${currentSlug}:`, error);
    return [];
  }
}

// Generate a URL-friendly slug from a title
export async function generateSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let finalSlug = baseSlug;
  let counter = 1;

  while (true) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM posts WHERE slug = ?',
      [finalSlug]
    );
    if (rows.length === 0) break;
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

// Calculate estimated read time based on content
export function calculateReadTime(content: string): string {
  // Strip HTML tags for word counting
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes <= 1 ? '1 min read' : `${minutes} min read`;
}

// Create a new post
export interface CreatePostInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  status: 'draft' | 'published';
}

export async function createPost(postData: CreatePostInput, authorId: number): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const slug = await generateSlug(postData.title);
    const readTime = calculateReadTime(postData.content);
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    await pool.query(
      `INSERT INTO posts (slug, title, excerpt, date, readTime, category, content, views, image, author_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
      [slug, postData.title, postData.excerpt, date, readTime, postData.category, postData.content, postData.image, authorId, postData.status]
    );

    return { success: true, slug };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}

// Update an existing post
export async function updatePost(slug: string, postData: Partial<CreatePostInput>, authorId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify the post belongs to this author
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM posts WHERE slug = ? AND author_id = ?',
      [slug, authorId]
    );

    if (rows.length === 0) {
      return { success: false, error: 'Post not found or unauthorized' };
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (postData.title) {
      updates.push('title = ?');
      values.push(postData.title);
    }
    if (postData.excerpt) {
      updates.push('excerpt = ?');
      values.push(postData.excerpt);
    }
    if (postData.content) {
      updates.push('content = ?');
      values.push(postData.content);
      updates.push('readTime = ?');
      values.push(calculateReadTime(postData.content));
    }
    if (postData.category) {
      updates.push('category = ?');
      values.push(postData.category);
    }
    if (postData.image) {
      updates.push('image = ?');
      values.push(postData.image);
    }
    if (postData.status) {
      updates.push('status = ?');
      values.push(postData.status);
    }

    if (updates.length === 0) {
      return { success: true }; // Nothing to update
    }

    values.push(slug);
    await pool.query(
      `UPDATE posts SET ${updates.join(', ')} WHERE slug = ?`,
      values
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: 'Failed to update post' };
  }
}

// Get posts by a specific user (for "My Posts" feature)
export async function getUserPosts(authorId: number): Promise<Post[]> {
  try {
    interface PostRow extends RowDataPacket {
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      category: string;
      content: string;
      views: number;
      image: string | null;
      status: string;
    }

    const [rows] = await pool.query<PostRow[]>(
      `SELECT slug, title, excerpt, date, readTime, category, content, views, image, status
       FROM posts WHERE author_id = ? ORDER BY created_at DESC`,
      [authorId]
    );

    return rows as unknown as Post[];
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}

// Get paginated posts by a specific user (for "My Posts" feature with server-side pagination)
export interface UserPostsStats {
  total: number;
  published: number;
  drafts: number;
  totalViews: number;
}

export async function getPaginatedUserPosts(
  authorId: number,
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[], stats: UserPostsStats, totalPages: number }> {
  try {
    const offset = (page - 1) * limit;

    // Get stats (total counts and views)
    const [statsRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' OR status IS NULL THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts,
        COALESCE(SUM(views), 0) as totalViews
       FROM posts WHERE author_id = ?`,
      [authorId]
    );

    const stats: UserPostsStats = {
      total: Number(statsRows[0].total) || 0,
      published: Number(statsRows[0].published) || 0,
      drafts: Number(statsRows[0].drafts) || 0,
      totalViews: Number(statsRows[0].totalViews) || 0
    };

    const totalPages = Math.ceil(stats.total / limit);

    // Get paginated posts
    interface PostRow extends RowDataPacket {
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      category: string;
      views: number;
      image: string | null;
      status: string;
    }

    const [rows] = await pool.query<PostRow[]>(
      `SELECT slug, title, excerpt, date, readTime, category, views, image, status
       FROM posts WHERE author_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [authorId, limit, offset]
    );

    return {
      posts: rows as unknown as Post[],
      stats,
      totalPages
    };
  } catch (error) {
    console.error('Error fetching paginated user posts:', error);
    return {
      posts: [],
      stats: { total: 0, published: 0, drafts: 0, totalViews: 0 },
      totalPages: 0
    };
  }
}

// Get a post for editing (includes draft posts for the author)
export async function getPostForEdit(slug: string, authorId: number): Promise<Post | null> {
  try {
    interface PostRow extends RowDataPacket {
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      category: string;
      content: string;
      views: number;
      image: string | null;
      status: string;
    }

    const [rows] = await pool.query<PostRow[]>(
      `SELECT slug, title, excerpt, date, readTime, category, content, views, image, status
       FROM posts WHERE slug = ? AND author_id = ?`,
      [slug, authorId]
    );

    if (rows.length === 0) return null;
    return rows[0] as unknown as Post;
  } catch (error) {
    console.error('Error fetching post for edit:', error);
    return null;
  }
}

// LinkedIn tracking functions
export interface LinkedInPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  posted_in_linkedin: boolean;
}

export async function getUnpostedLinkedInPosts(limit: number = 10): Promise<LinkedInPost[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT slug, title, date, category, COALESCE(posted_in_linkedin, 0) as posted_in_linkedin
       FROM posts 
       WHERE (posted_in_linkedin = 0 OR posted_in_linkedin IS NULL)
         AND (status = 'published' OR status IS NULL)
       ORDER BY date ASC
       LIMIT ?`,
      [limit]
    );
    return rows as unknown as LinkedInPost[];
  } catch (error) {
    console.error('Error fetching unposted LinkedIn posts:', error);
    return [];
  }
}

export async function markPostedInLinkedIn(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    await pool.query(
      'UPDATE posts SET posted_in_linkedin = 1 WHERE slug = ?',
      [slug]
    );
    return { success: true };
  } catch (error) {
    console.error('Error marking post as posted in LinkedIn:', error);
    return { success: false, error: 'Failed to update post' };
  }
}

