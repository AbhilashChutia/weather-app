"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Check, Loader2, X } from "lucide-react";
import { setHomeLocation, removeHomeLocation } from "@/app/actions/user";

interface SetHomeButtonProps {
    cityName: string;
    lat: number;
    lon: number;
    isCurrentHome: boolean;
}

export default function SetHomeButton({
    cityName,
    lat,
    lon,
    isCurrentHome,
}: SetHomeButtonProps) {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(isCurrentHome);
    const [isHovering, setIsHovering] = useState(false);

    const handleToggleHome = async () => {
        setLoading(true);

        if (saved) {
            const res = await removeHomeLocation();
            if (res.success) {
                setSaved(false);
            } else {
                alert(res.error || "Failed to remove home location");
            }
        } else {
            const res = await setHomeLocation(cityName, lat, lon);
            if (res.success) {
                setSaved(true);
            } else {
                alert(res.error || "Failed to set home location");
            }
        }

        setLoading(false);
    };

    return (
        <Button
            variant={saved ? "secondary" : "outline"}
            onClick={handleToggleHome}
            disabled={loading}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`flex items-center gap-2 transition-all ${
                saved && isHovering
                    ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/50 dark:hover:bg-red-900/50 dark:text-red-400 border-red-200 dark:border-red-900"
                    : ""
            }`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
                isHovering ? (
                    <X className="w-4 h-4" />
                ) : (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                )
            ) : (
                <Home className="w-4 h-4" />
            )}

            {saved
                ? isHovering
                    ? "Remove Home"
                    : "Current Home"
                : "Set as Home"}
        </Button>
    );
}
