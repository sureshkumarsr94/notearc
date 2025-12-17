'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    ArrowLeft,
    Save,
    Send,
    Loader2,
    FileText,
    Sparkles
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

export default function WritePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');


    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const [saveMessage, setSaveMessage] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Redirect to sign in if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('google', { callbackUrl: '/write' });
        }
    }, [status]);



    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) newErrors.title = 'Title is required';
        if (!excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
        if (!content.trim() || content === '<p><br></p>') newErrors.content = 'Content is required';
        if (!category) newErrors.category = 'Category is required';


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save as draft
    const handleSaveDraft = async () => {
        // For drafts, we only need title
        if (!title.trim()) {
            setErrors({ title: 'Title is required to save a draft' });
            return;
        }

        setIsSaving(true);
        setSaveMessage('');

        try {


            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    excerpt: excerpt || 'Draft post',
                    content: content || '',
                    category: category || 'Other',
                    image: '/images/placeholder.jpg',
                    status: 'draft'
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save draft');
            }

            const data = await response.json();
            setSaveMessage('Draft saved successfully!');

            // Redirect to edit page after a moment
            setTimeout(() => {
                router.push(`/write/${data.slug}`);
            }, 1000);
        } catch (error) {
            console.error('Error saving draft:', error);
            setSaveMessage('Failed to save draft');
        } finally {
            setIsSaving(false);
        }
    };

    // Publish post
    const handlePublish = async () => {
        if (!validateForm()) return;

        setIsPublishing(true);
        setSaveMessage('');

        try {


            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    excerpt,
                    content,
                    category,
                    image: '/images/placeholder.jpg',
                    status: 'published'
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to publish post');
            }

            const data = await response.json();
            setSaveMessage('Published successfully!');

            // Redirect to the new post
            setTimeout(() => {
                router.push(`/blog/${data.slug}`);
            }, 1000);
        } catch (error) {
            console.error('Error publishing post:', error);
            setSaveMessage('Failed to publish post');
        } finally {
            setIsPublishing(false);
        }
    };

    // Show loading state while checking auth
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show sign in prompt if not authenticated
    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-4 bg-orange-100 rounded-full">
                        <FileText className="h-8 w-8 text-orange-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Sign in to Write</h1>
                    <p className="text-gray-600">You need to be signed in to create blog posts.</p>
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/write' })}
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
                                href="/blog"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span className="hidden sm:inline">Back</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300" />
                            <h1 className="text-lg font-semibold text-gray-900">Write a Story</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {saveMessage && (
                                <span className={`text-sm ${saveMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                                    {saveMessage}
                                </span>
                            )}

                            <button
                                onClick={handleSaveDraft}
                                disabled={isSaving || isPublishing}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span className="hidden sm:inline">Save Draft</span>
                            </button>

                            <button
                                onClick={handlePublish}
                                disabled={isSaving || isPublishing}
                                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {isPublishing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                <span>Publish</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Editor */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">


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
                        placeholder="Write a brief excerpt that will appear in post previews..."
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

            {/* Custom styles for Quill editor */}
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
        
        .write-editor .ql-editor h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .write-editor .ql-editor h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        
        .write-editor .ql-editor h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .write-editor .ql-editor p {
          margin-bottom: 1rem;
        }
        
        .write-editor .ql-editor blockquote {
          border-left: 4px solid #f97316;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #4b5563;
          font-style: italic;
        }
        
        .write-editor .ql-editor pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
      `}</style>
        </div>
    );
}
