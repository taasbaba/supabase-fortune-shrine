import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { NavBar } from "./components/NavBar";
import { ShrineFortune } from "./components/ShrineFortune";
import { WeatherSlider } from "./components/WeatherSlider";
import { BubbleMessages } from "./components/BubbleMessages";
import { WeatherInfo, FortuneResult } from "./types";
import { supabase } from "./lib/supabaseClient";
import { LoadingOverlay } from "./components/LoadingOverlay";

const cities = ["Tokyo", "Taipei", "Paris", "New York"];

const EDGE_FORTUNE_URL = process.env.REACT_APP_EDGE_FORTUNE_URL;
if (!EDGE_FORTUNE_URL) {
  throw new Error("Missing REACT_APP_EDGE_FORTUNE_URL in .env");
}

const App = () => {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherInfo>>(
    {}
  );
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(true); // for loading weather info
  const [user, setUser] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      const fetches = cities.map(async (city) => {
        try {
          const res = await fetch(
            `${EDGE_FORTUNE_URL}?action=weather&city=${city}`
          );
          const data = await res.json();

          if (data && data.weather && Array.isArray(data.weather)) {
            return { city, data };
          }

          if (
            data?.data &&
            data.data.weather &&
            Array.isArray(data.data.weather)
          ) {
            return { city, data: data.data };
          }

          console.warn(`Invalid weather for ${city}`, data);
          return { city, data: null };
        } catch (err) {
          console.error(`Failed to fetch weather for ${city}:`, err);
          return { city, data: null };
        }
      });

      const results = await Promise.all(fetches);
      const mapped: Record<string, WeatherInfo> = {};
      results.forEach(({ city, data }) => {
        if (data) mapped[city] = data;
      });

      setWeatherData(mapped);
      setLoading(false);
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    console.log("[Supabase] Checking session...");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[Supabase] Initial session:", session);
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`[Supabase] Auth state changed: ${event}`, session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      console.log("[Supabase] Cleaning up auth listener");
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleDraw = async () => {
    setIsDrawing(true); // To show the loading mask

    const timeout = setTimeout(() => {
      setIsDrawing(false);
      alert("The fortune draw took too long. Please try again.");
    }, 10000);

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      const res = await fetch(`${EDGE_FORTUNE_URL}?action=draw-lottery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && {
            Authorization: `Bearer ${accessToken}`, // ✅ 加上 token
          }),
        },
        body: JSON.stringify({
          email: user?.email ?? null, // 可有可無，真正驗證是靠 token
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to draw fortune");
      }

      setFortune(data);
    } catch (err) {
      console.error("[Draw] Error:", err);
      alert("Something went wrong when drawing your fortune.");
    } finally {
      clearTimeout(timeout);
      setIsDrawing(false); // To remove the loading mask
    }
  };

  return (
    <div className="App bg-light" style={{ minHeight: "100vh" }}>
      <NavBar />

      <ShrineFortune onDraw={handleDraw} fortune={fortune} userEmail={user?.email ?? null}/>

      <div className="bg-white py-3 shadow-sm">
        <div className="container">
          <WeatherSlider
            cities={cities}
            weatherData={weatherData}
            loading={loading}
          />
        </div>
      </div>

      <BubbleMessages userEmail={user?.email ?? null} />

      {user && (
        <div className="container text-center text-success mt-4">
          Logged in as <strong>{user.email}</strong>
        </div>
      )}

      {isDrawing && <LoadingOverlay message="🔮 Drawing your fortune..." />}
    </div>
  );
};

export default App;
