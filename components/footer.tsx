import Link from "next/link";
import { CloudSun } from "lucide-react";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t bg-white dark:bg-gray-950 mt-auto">
            <div className="container mx-auto px-4 py-8 md:flex md:items-center md:justify-between">
                <div className="flex justify-center md:justify-start mb-4 md:mb-0 items-center gap-2">
                    <CloudSun className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">
                        WeatherNow
                    </span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                    <p>© {currentYear} WeatherNow. All rights reserved.</p>
                    <div className="hidden md:block text-gray-300">|</div>
                    <div className="flex gap-4">
                        <Link
                            href="/privacy"
                            className="hover:text-gray-900 hover:underline"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="hover:text-gray-900 hover:underline"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end gap-4 mt-4 md:mt-0 text-gray-400">
                    <Link
                        href="https://github.com"
                        target="_blank"
                        className="hover:text-gray-900 transition-colors"
                    >
                        <FaGithub className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </Link>
                    <Link
                        href="https://twitter.com"
                        target="_blank"
                        className="hover:text-blue-400 transition-colors"
                    >
                        <FaTwitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
