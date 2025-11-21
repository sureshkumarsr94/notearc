import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 py-6">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold">
                        N
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        NoteArc
                    </span>
                </Link>

                <div className="text-sm text-gray-500 md:order-3">
                    © {new Date().getFullYear()} NoteArc. All rights reserved.
                </div>

                <div className="flex space-x-6 md:order-2">
                    <Link href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </Link>
                    <Link href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
