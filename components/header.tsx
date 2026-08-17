"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudSun, Search, User, MapPin, Loader2 } from "lucide-react";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

interface CityResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
}

export default function Header() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<CityResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (searchQuery.trim().length < 2) {
                setResults([]);
                setShowDropdown(false);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`,
                );
                const data = await res.json();
                if (data.results) {
                    setResults(data.results);
                    setShowDropdown(true);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Failed to fetch cities", error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(fetchCities, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSelectCity = (city: CityResult) => {
        setSearchQuery("");
        setShowDropdown(false);

        router.push(
            `/weather?lat=${city.latitude}&lon=${city.longitude}&name=${encodeURIComponent(city.name)}`,
        );
    };

    const handleSignOut = async () => {
        await authClient.signOut();
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-gray-950/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <CloudSun className="h-6 w-6 text-blue-500" />
                    <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
                        WeatherNow
                    </span>
                </Link>

                <div
                    className="relative w-full max-w-md mx-4"
                    ref={dropdownRef}
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for a city..."
                            className="w-full pl-9 bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 focus-visible:ring-blue-500 dark:text-slate-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                                if (results.length > 0) setShowDropdown(true);
                            }}
                        />
                        {isSearching && (
                            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
                        )}
                    </div>

                    {showDropdown && results.length > 0 && (
                        <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-950 rounded-md border border-gray-200 dark:border-slate-800 shadow-lg overflow-hidden z-50">
                            {results.map((city) => (
                                <button
                                    key={city.id}
                                    onClick={() => handleSelectCity(city)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-900 flex items-center gap-3 transition-colors border-b border-gray-100 dark:border-slate-800/50 last:border-0"
                                >
                                    <MapPin className="h-4 w-4 text-gray-400 dark:text-slate-500 shrink-0" />
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-medium text-sm truncate text-slate-900 dark:text-slate-100">
                                            {city.name}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                            {city.admin1
                                                ? `${city.admin1}, `
                                                : ""}
                                            {city.country}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {isPending ? (
                        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md" />
                    ) : session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center p-0"
                                >
                                    {session.user.name ? (
                                        <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                                            {session.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    ) : (
                                        <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {session.user.name}
                                        </p>
                                        <p className="text-xs leading-none text-gray-500">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="text-red-600 dark:text-red-400"
                                >
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                asChild
                                className="hidden sm:flex"
                            >
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/sign-up">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
