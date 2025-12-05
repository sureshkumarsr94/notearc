"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    fallbackUrl?: string;
    label?: string;
}

export default function BackButton({ fallbackUrl = "/", label = "Go Back" }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        // Check if there's history to go back to
        if (window.history.length > 1) {
            router.back();
        } else {
            // Fallback to specified URL if no history
            router.push(fallbackUrl);
        }
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-8"
        >
            <ArrowLeft className="h-4 w-4" />
            {label}
        </button>
    );
}
