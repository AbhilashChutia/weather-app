import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudFog,
} from "lucide-react";

// Types matching the Open-Meteo API response structure
interface WeatherData {
    current: {
        temperature_2m: number;
        weather_code: number;
    };
    daily: {
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}

interface WeatherCardProps {
    cityName: string;
    data: WeatherData;
}

// Maps WMO standard weather codes to Lucide React icons
const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-12 h-12 text-yellow-500" />;
    if (code >= 1 && code <= 3)
        return <Cloud className="w-12 h-12 text-gray-400" />;
    if (code >= 45 && code <= 48)
        return <CloudFog className="w-12 h-12 text-gray-500" />;
    if (code >= 51 && code <= 67)
        return <CloudRain className="w-12 h-12 text-blue-500" />;
    if (code >= 71 && code <= 77)
        return <CloudSnow className="w-12 h-12 text-blue-200" />;
    if (code >= 95)
        return <CloudLightning className="w-12 h-12 text-yellow-600" />;
    return <Sun className="w-12 h-12 text-yellow-500" />;
};

const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear sky";
    if (code >= 1 && code <= 3) return "Partly cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 95) return "Thunderstorm";
    return "Unknown";
};

export default function WeatherCard({ cityName, data }: WeatherCardProps) {
    const currentTemp = Math.round(data.current.temperature_2m);
    const highTemp = Math.round(data.daily.temperature_2m_max[0]);
    const lowTemp = Math.round(data.daily.temperature_2m_min[0]);
    const weatherCode = data.current.weather_code;

    return (
        <Card className="w-full max-w-sm overflow-hidden p-0 border-gray-200 dark:border-slate-800 transition-all hover:shadow-md">
            <CardHeader className="m-0 px-6 py-4 bg-linear-to-br from-blue-500 via-blue-400 to-cyan-400 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-b border-black/5 dark:border-white/5">
                <CardTitle className="text-2xl font-semibold tracking-tight text-white dark:text-slate-100">
                    {cityName}
                </CardTitle>
                <p className="text-sm text-blue-50 dark:text-slate-400 capitalize">
                    {getWeatherDescription(weatherCode)}
                </p>
            </CardHeader>

            <CardContent className="px-6 pt-6 pb-6 bg-white dark:bg-card">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-5xl font-bold tracking-tighter text-slate-900 dark:text-slate-100">
                            {currentTemp}°
                            <span className="text-3xl text-yellow-400 dark:text-yellow-400 ml-1">
                                C
                            </span>
                        </span>
                        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <span>H: {highTemp}°</span>
                            <span>•</span>
                            <span>L: {lowTemp}°</span>
                        </div>
                    </div>
                    <div className="rounded-full bg-gray-50 dark:bg-slate-800 p-3 shadow-inner">
                        {getWeatherIcon(weatherCode)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
