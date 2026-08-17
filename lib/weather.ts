export async function getDetailedWeatherData(lat: number, lon: number) {
    const safeLat = lat || 0;
    const safeLon = lon || 0;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${safeLat}&longitude=${safeLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&timezone=auto`;

    const res = await fetch(url, { next: { revalidate: 1800 } });

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`\n❌ Open-Meteo Error (${res.status}):`, errorText);
        throw new Error(`Failed to fetch weather data: ${res.statusText}`);
    }

    return res.json();
}
