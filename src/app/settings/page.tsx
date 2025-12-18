'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Settings, User, Save, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import AuthorAvatar from '@/components/AuthorAvatar';

interface UserProfile {
    id: number;
    name: string;
    alias_name: string | null;
    email: string;
    image: string;
    bio: string | null;
    role: string;
    slug: string;
}

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        alias_name: '',
        bio: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    setFormData({
                        alias_name: data.alias_name || '',
                        bio: data.bio || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        }

        if (session?.user?.id) {
            fetchProfile();
        }
    }, [session?.user?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update local profile state
                setProfile(prev => prev ? { ...prev, ...formData } : null);
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setSaving(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-orange-100/30 blur-3xl -z-10" />
            <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-3xl -z-10" />

            <div className="container mx-auto px-4 py-12 max-w-2xl">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                        <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                            Settings
                        </h1>
                        <p className="text-sm text-gray-500">Manage your profile and preferences</p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Current Profile Info */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
                        <div className="flex items-center gap-4">
                            <AuthorAvatar
                                name={profile?.name || session.user?.name || ''}
                                src={profile?.image || session.user?.image || ''}
                                className="h-16 w-16 ring-2 ring-white shadow-md"
                            />
                            <div>
                                <h2 className="font-bold text-lg text-gray-900">
                                    {profile?.alias_name || profile?.name || session.user?.name}
                                </h2>
                                <p className="text-sm text-gray-500">{profile?.email || session.user?.email}</p>
                                <p className="text-xs text-orange-600 font-medium mt-1">{profile?.role || 'Author'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Alias Name */}
                        <div>
                            <label htmlFor="alias_name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <User className="h-4 w-4 text-gray-400" />
                                Display Name (Alias)
                            </label>
                            <input
                                type="text"
                                id="alias_name"
                                value={formData.alias_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, alias_name: e.target.value }))}
                                placeholder={profile?.name || 'Enter your display name'}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                This name will be displayed on your profile and blog posts. Leave empty to use your real name.
                            </p>
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Settings className="h-4 w-4 text-gray-400" />
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Tell readers about yourself..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`flex items-center gap-2 p-4 rounded-xl ${message.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {message.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5" />
                                )}
                                <span className="text-sm font-medium">{message.text}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-sm text-blue-700">
                        <strong>Tip:</strong> Your display name (alias) will be shown instead of your real name across the site. This helps maintain privacy while building your author brand.
                    </p>
                </div>
            </div>
        </div>
    );
}
