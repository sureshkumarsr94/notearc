'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    ArrowLeft,
    Save,
    Send,
    ImagePlus,
    X,
    Loader2,
    FileText,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
});
import 'react-quill-new/dist/quill.snow.css';

const categories = [
    'Personal Development',
    'Self-Help',
    'Productivity',
    'Mindset',
    'Career',
    'Leadership',
    'Wellness',
    'Technology',
    'Lifestyle',
    'Finance',
    'Other'
];

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ 'align': [] }],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image',
    'align'
];

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function EditPostPage({ params }: PageProps) {
    const { slug } = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [postStatus, setPostStatus] = useState<'draft' | 'published'>('draft');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [notFound, setNotFound] = useState(false);

    // Redirect to sign in if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('google', { callbackUrl: `/write/${slug}` });
        }
    }, [status, slug]);

    // Fetch existing post data
    useEffect(() => {
        async function fetchPost() {
            if (status !== 'authenticated') return;

            try {
                const response = await fetch(`/api/posts/${slug}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true);
                    }
                    return;
                }

                const data = await response.json();
                const post = data.post;

                setTitle(post.title || '');
                setExcerpt(post.excerpt || '');
                setContent(post.content || '');
                setCategory(post.category || '');
                setCoverImage(post.image || '');
                setPostStatus(post.status || 'draft');
            } catch (error) {
                console.error('Error fetching post:', error);
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPost();
    }, [slug, status]);

    // Handle image file selection
    const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // Upload image to S3
    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) {
            if (coverImage) return coverImage;
            return null;
        }

        setIsUploading(true);
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: imageFile.name,
                    contentType: imageFile.type
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get upload URL');
            }

            const { uploadUrl, publicUrl } = await response.json();

            await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': imageFile.type },
                body: imageFile,
            });

            setCoverImage(publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            setErrors(prev => ({ ...prev, image: 'Failed to upload image' }));
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) newErrors.title = 'Title is required';
        if (!excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
        if (!content.trim() || content === '<p><br></p>') newErrors.content = 'Content is required';
        if (!category) newErrors.category = 'Category is required';
        if (!imageFile && !coverImage) newErrors.image = 'Cover image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save changes
    const handleSave = async (publishStatus: 'draft' | 'published') => {
        if (publishStatus === 'published' && !validateForm()) return;

        if (publishStatus === 'draft' && !title.trim()) {
            setErrors({ title: 'Title is required to save' });
            return;
        }

        const setLoading = publishStatus === 'published' ? setIsPublishing : setIsSaving;
        setLoading(true);
        setSaveMessage('');

        try {
            let imageUrl = coverImage;
            if (imageFile) {
                const uploadedUrl = await uploadImage();
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const response = await fetch('/api/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    title,
                    excerpt: excerpt || 'Draft post',
                    content: content || '',
                    category: category || 'Other',
                    image: imageUrl || '/images/placeholder.jpg',
                    status: publishStatus
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save');
            }

            setSaveMessage(publishStatus === 'published' ? 'Published!' : 'Saved!');
            setPostStatus(publishStatus);

            if (publishStatus === 'published') {
                setTimeout(() => {
                    router.push(`/blog/${slug}`);
                }, 1000);
            }
        } catch (error) {
            console.error('Error saving post:', error);
            setSaveMessage('Failed to save');
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    <p className="text-gray-600">Loading post...</p>
                </div>
            </div>
        );
    }

    // Not found
    if (notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-4 bg-red-100 rounded-full">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Post Not Found</h1>
                    <p className="text-gray-600">This post doesn't exist or you don't have permission to edit it.</p>
                    <Link
                        href="/my-posts"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        View My Posts
                    </Link>
                </div>
            </div>
        );
    }

    // Unauthenticated
    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-4 bg-orange-100 rounded-full">
                        <FileText className="h-8 w-8 text-orange-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Sign in to Edit</h1>
                    <p className="text-gray-600">You need to be signed in to edit blog posts.</p>
                    <button
                        onClick={() => signIn('google', { callbackUrl: `/write/${slug}` })}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Sparkles className="h-5 w-5" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/my-posts"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span className="hidden sm:inline">My Posts</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300" />
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-semibold text-gray-900">Edit Story</h1>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${postStatus === 'published'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {postStatus === 'published' ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {saveMessage && (
                                <span className={`text-sm ${saveMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                                    {saveMessage}
                                </span>
                            )}

                            <button
                                onClick={() => handleSave('draft')}
                                disabled={isSaving || isPublishing}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span className="hidden sm:inline">Save</span>
                            </button>

                            <button
                                onClick={() => handleSave('published')}
                                disabled={isSaving || isPublishing}
                                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {isPublishing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                <span>{postStatus === 'published' ? 'Update' : 'Publish'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Editor */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Cover Image */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image <span className="text-red-500">*</span>
                    </label>

                    {imagePreview || coverImage ? (
                        <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100">
                            <img
                                src={imagePreview || coverImage}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview('');
                                    setCoverImage('');
                                }}
                                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <label className={`flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                            }`}>
                            <div className="flex flex-col items-center justify-center py-12">
                                <ImagePlus className={`h-12 w-12 mb-4 ${errors.image ? 'text-red-400' : 'text-gray-400'}`} />
                                <p className={`text-sm ${errors.image ? 'text-red-600' : 'text-gray-600'}`}>
                                    Click to upload cover image
                                </p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </label>
                    )}
                    {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                </div>

                {/* Title */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full text-4xl font-bold bg-transparent border-none outline-none placeholder-gray-300 ${errors.title ? 'text-red-600 placeholder-red-300' : 'text-gray-900'
                            }`}
                    />
                    {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                </div>

                {/* Excerpt */}
                <div className="mb-6">
                    <textarea
                        placeholder="Write a brief excerpt..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={2}
                        className={`w-full text-lg bg-transparent border-none outline-none resize-none placeholder-gray-400 ${errors.excerpt ? 'text-red-600 placeholder-red-300' : 'text-gray-600'
                            }`}
                    />
                    {errors.excerpt && <p className="mt-2 text-sm text-red-600">{errors.excerpt}</p>}
                </div>

                {/* Category */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border bg-white ${errors.category ? 'border-red-300' : 'border-gray-300'
                            } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors`}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
                </div>

                {/* Rich Text Editor */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <div className={`bg-white rounded-2xl overflow-hidden ${errors.content ? 'ring-2 ring-red-300' : ''}`}>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Tell your story..."
                            className="write-editor"
                        />
                    </div>
                    {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
                </div>
            </main>

            {/* Custom styles */}
            <style jsx global>{`
        .write-editor .ql-container {
          min-height: 400px;
          font-size: 1.125rem;
          font-family: inherit;
          border: none;
          border-top: 1px solid #e5e7eb;
        }
        .write-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .write-editor .ql-editor {
          padding: 1.5rem;
          line-height: 1.75;
        }
        .write-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
      `}</style>
        </div>
    );
}
