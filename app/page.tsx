import { getDetailedWeatherData } from "@/lib/weather";
import WeatherCard from "@/components/weather-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function HomePage() {
    const topCities = [
        { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
        { name: "New York", lat: 40.7128, lon: -74.006 },
        { name: "London", lat: 51.5074, lon: -0.1278 },
        { name: "Paris", lat: 48.8566, lon: 2.3522 },
        { name: "Sydney", lat: -33.8688, lon: 151.2093 },
        { name: "Dubai", lat: 25.2048, lon: 55.2708 },
    ];

    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    const weatherPromises = topCities.map((city) =>
        getDetailedWeatherData(city.lat, city.lon),
    );
    const weatherResults = await Promise.all(weatherPromises);

    let homeWeather = null;
    if (user?.homeLat && user?.homeLon) {
        homeWeather = await getDetailedWeatherData(user.homeLat, user.homeLon);
    }

    return (
        <main className="container mx-auto px-4 py-8 flex-1">
            {/* 

      */}
            {user && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Your Home
                    </h2>

                    {homeWeather && user.homeCity ? (
                        <div className="flex justify-center md:justify-start">
                            <Link
                                href={`/weather?lat=${user.homeLat}&lon=${user.homeLon}&name=${user.homeCity}`}
                                className="w-full max-w-sm block transition-transform hover:scale-[1.02]"
                            >
                                <WeatherCard
                                    data={homeWeather}
                                    cityName={user.homeCity}
                                />
                            </Link>
                        </div>
                    ) : (
                        <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center max-w-2xl mx-auto md:mx-0">
                            <div className="mx-auto w-12 h-12 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Search className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                No home location set
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                Use the search bar in the header to find your
                                city, then click the{" "}
                                <strong>"Set as Home"</strong> button on its
                                weather page to pin it here!
                            </p>
                        </div>
                    )}
                </div>
            )}

            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center md:text-left">
                Global Weather
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center md:place-items-start">
                {topCities.map((city, index) => (
                    <Link
                        href={`/weather?lat=${city.lat}&lon=${city.lon}&name=${city.name}`}
                        key={city.name}
                        className="w-full max-w-sm block transition-transform hover:scale-[1.02]"
                    >
                        <WeatherCard
                            data={weatherResults[index]}
                            cityName={city.name}
                        />
                    </Link>
                ))}
            </div>
        </main>
    );
}
