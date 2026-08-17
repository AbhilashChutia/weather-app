import { getDetailedWeatherData } from "@/lib/weather";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SetHomeButton from "@/components/set-home-button";
import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudFog,
    Wind,
    Droplets,
    Thermometer,
    Gauge,
    SunMedium,
    Umbrella,
} from "lucide-react";

type Props = {
    searchParams: Promise<{ lat: string; lon: string; name: string }>;
};

const getWeatherIcon = (code: number, size = "w-10 h-10") => {
    if (code === 0) return <Sun className={`${size} text-yellow-500`} />;
    if (code >= 1 && code <= 3)
        return <Cloud className={`${size} text-gray-400`} />;
    if (code >= 45 && code <= 48)
        return <CloudFog className={`${size} text-gray-500`} />;
    if (code >= 51 && code <= 67)
        return <CloudRain className={`${size} text-blue-500`} />;
    if (code >= 71 && code <= 77)
        return <CloudSnow className={`${size} text-blue-200`} />;
    if (code >= 95)
        return <CloudLightning className={`${size} text-yellow-600`} />;
    return <Sun className={`${size} text-yellow-500`} />;
};

const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear sky";
    if (code >= 1 && code <= 3) return "Partly cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 95) return "Thunderstorm";
    return "Clear sky";
};

const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
};

export default async function WeatherPage({ searchParams }: Props) {
    const { lat, lon, name } = await searchParams;

    if (!lat || !lon || !name) {
        return (
            <main className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold mb-4">Invalid City Data</h1>
                <p className="text-slate-500 mb-6">
                    No geographical coordinates were provided.
                </p>
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </main>
        );
    }

    const numLat = Number(lat);
    const numLon = Number(lon);

    const [weather, session] = await Promise.all([
        getDetailedWeatherData(numLat, numLon),
        auth.api.getSession({ headers: await headers() }),
    ]);

    const user = session?.user;
    const isCurrentHome = user?.homeCity === name;

    const currentTemp = Math.round(weather.current.temperature_2m);
    const feelsLike = Math.round(weather.current.apparent_temperature);
    const highTemp = Math.round(weather.daily.temperature_2m_max[0]);
    const lowTemp = Math.round(weather.daily.temperature_2m_min[0]);
    const weatherCode = weather.current.weather_code;

    return (
        <main className="container mx-auto px-4 py-8 flex-1 max-w-5xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
                        {name}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Lat: {numLat.toFixed(2)}° • Lon: {numLon.toFixed(2)}°
                    </p>
                </div>

                <div>
                    {user ? (
                        <SetHomeButton
                            cityName={name}
                            lat={numLat}
                            lon={numLon}
                            isCurrentHome={isCurrentHome}
                        />
                    ) : (
                        <Button variant="outline" asChild>
                            <Link href="/sign-in">
                                Sign in to save location
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-linear-to-br from-blue-500/10 via-background to-background p-6 sm:p-8 mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            Current Weather
                        </div>
                        <div className="flex items-baseline gap-4">
                            <span className="text-6xl sm:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white">
                                {currentTemp}°
                            </span>
                            <span className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 capitalize">
                                {getWeatherDescription(weatherCode)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <span>High: {highTemp}°</span>
                            <span>•</span>
                            <span>Low: {lowTemp}°</span>
                            <span>•</span>
                            <span>Feels like {feelsLike}°</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-black/5 dark:border-white/5 shadow-inner">
                        {getWeatherIcon(weatherCode, "w-20 h-20")}
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                Today's Conditions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-medium">Feels Like</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {feelsLike}°C
                    </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">Humidity</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {weather.current.relative_humidity_2m}%
                    </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                        <Wind className="w-4 h-4 text-teal-500" />
                        <span className="text-xs font-medium">Wind Speed</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {weather.current.wind_speed_10m} km/h
                    </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                        <SunMedium className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium">UV Index</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {weather.daily.uv_index_max[0]}
                    </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                        <Umbrella className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-medium">
                            Precipitation
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {weather.daily.precipitation_probability_max[0]}%
                    </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                        <Gauge className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium">Pressure</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {Math.round(weather.current.surface_pressure)} hPa
                    </p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                7-Day Forecast
            </h2>
            <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 divide-y divide-gray-100 dark:divide-slate-900 overflow-hidden">
                {weather.daily.time.map((date: string, idx: number) => (
                    <div
                        key={date}
                        className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                        <span className="w-20 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {idx === 0 ? "Today" : getDayName(date)}
                        </span>

                        <div className="flex items-center gap-2 sm:gap-3 flex-1 px-4">
                            {getWeatherIcon(
                                weather.daily.weather_code[idx],
                                "w-6 h-6",
                            )}
                            <span className="text-sm text-slate-600 dark:text-slate-400 capitalize hidden sm:inline-block">
                                {getWeatherDescription(
                                    weather.daily.weather_code[idx],
                                )}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {Math.round(
                                    weather.daily.temperature_2m_max[idx],
                                )}
                                °
                            </span>
                            <span className="text-slate-400 dark:text-slate-500">
                                {Math.round(
                                    weather.daily.temperature_2m_min[idx],
                                )}
                                °
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
