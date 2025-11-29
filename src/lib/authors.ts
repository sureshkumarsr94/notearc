import pool from './db';
import { RowDataPacket } from 'mysql2';

export interface Author {
    id: number;
    name: string;
    slug: string;
    bio: string;
    avatar: string;
    role: string;
    social_twitter?: string;
    social_linkedin?: string;
}

export async function getAllAuthors(): Promise<Author[]> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, name, slug, bio, image as avatar, role, social_twitter, social_linkedin FROM users WHERE slug IS NOT NULL'
        );
        return rows as unknown as Author[];
    } catch (error) {
        console.error('Error fetching authors:', error);
        return [];
    }
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, name, slug, bio, image as avatar, role, social_twitter, social_linkedin FROM users WHERE slug = ?',
            [slug]
        );
        if (rows.length === 0) return undefined;
        return rows[0] as unknown as Author;
    } catch (error) {
        console.error(`Error fetching author with slug ${slug}:`, error);
        return undefined;
    }
}
