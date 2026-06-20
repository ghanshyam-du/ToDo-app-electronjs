"use client";
import { useState, useEffect } from "react";

// Using Ahmedabad as a default city
const LAT = 23.0225;
const LON = 72.5714;

export default function Weather() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`);
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        setWeather(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
            Weather
          </h1>
          <p className="text-slate-400">Current conditions in Ahmedabad</p>
        </header>

        {loading ? (
          <div className="text-slate-500 animate-pulse py-12">Loading weather data...</div>
        ) : weather ? (
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-10 shadow-xl inline-block w-full max-w-md transition-all hover:border-slate-700 hover:shadow-orange-500/10">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="text-8xl font-light text-slate-100 tracking-tighter">
                {Math.round(weather.current_weather.temperature)}°
              </div>
              <div className="flex flex-col items-center gap-2 text-slate-400 mt-4">
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                  <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                  <span className="font-medium text-slate-300">Wind: {weather.current_weather.windspeed} km/h</span>
                </div>
                <div className="text-sm text-slate-500 mt-2">
                  Last updated: {new Date(weather.current_weather.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 py-12 border border-dashed border-slate-800 rounded-2xl">
            Failed to load weather
          </div>
        )}
      </div>
    </div>
  );
}
