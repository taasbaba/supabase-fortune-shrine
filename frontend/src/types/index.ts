export interface WeatherInfo {
  name: string;
  main: { temp: number };
  weather: { icon: string }[];
}

export interface FortuneResult {
  email: string | null;
  result: string;
  message: string;
  created_at: string;
}
