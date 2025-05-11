import React from "react";

interface WeatherIconProps {
  iconCode: string;
  size?: number;
}

const iconMap: Record<string, string> = {
  "01d": "wi-day-sunny",
  "01n": "wi-night-clear",
  "02d": "wi-day-cloudy",
  "02n": "wi-night-alt-cloudy",
  "03d": "wi-cloud",
  "03n": "wi-cloud",
  "04d": "wi-cloudy",
  "04n": "wi-cloudy",
  "09d": "wi-showers",
  "09n": "wi-showers",
  "10d": "wi-day-rain",
  "10n": "wi-night-alt-rain",
  "11d": "wi-thunderstorm",
  "11n": "wi-thunderstorm",
  "13d": "wi-snow",
  "13n": "wi-snow",
  "50d": "wi-fog",
  "50n": "wi-fog",
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  iconCode,
  size = 48,
}) => {
  const fileName = iconMap[iconCode] || "wi-na";
  const imagePath = `/icons/weather/${fileName}.svg`;

  return (
    <img
      src={imagePath}
      alt={fileName}
      width={size}
      height={size}
      title={iconCode}
      style={{ objectFit: "contain" }}
    />
  );
};
