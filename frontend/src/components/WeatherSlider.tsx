import React from 'react';
import { WeatherIcon } from "./WeatherIcon";

interface WeatherInfo {
  name: string;
  main: { temp: number };
  weather: { icon: string }[];
}

interface Props {
  cities: string[];
  weatherData: Record<string, WeatherInfo>;
  loading: boolean;
}

export const WeatherSlider: React.FC<Props> = ({ cities, weatherData, loading }) => {
  if (loading) {
    return <div className="text-center">Loading weather...</div>;
  }

  return (
    <div className="d-flex overflow-auto">
      {cities.map((city) => {
        const weather = weatherData[city];

        if (!weather || !weather.weather || !Array.isArray(weather.weather)) {
          return (
            <div key={city} className="card me-3" style={{ minWidth: '150px' }}>
              <div className="card-body text-center">
                <h6>{city}</h6>
                <div>--</div>
                <small>No data</small>
              </div>
            </div>
          );
        }

        return (
          <div key={city} className="card me-3" style={{ minWidth: '150px' }}>
            <div className="card-body text-center">
              <h6>{city}</h6>
              <WeatherIcon iconCode={weather.weather[0].icon} size={48} />
              <small>{Math.round(weather.main.temp)}°C</small>
            </div>
          </div>
        );
      })}
    </div>
  );
};