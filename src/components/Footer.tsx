import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 py-6">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2" aria-label="NoteArc - Home">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold">
                        N
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        NoteArc
                    </span>
                </Link>

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-gray-500 md:order-3">
                    <span>© {new Date().getFullYear()} NoteArc. All rights reserved.</span>
                    <div className="flex gap-4">
                        <Link href="/privacy-policy" className="hover:text-primary-600 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-conditions" className="hover:text-primary-600 transition-colors">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
