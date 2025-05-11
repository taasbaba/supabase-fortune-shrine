import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Initializing Supabase client...");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
console.log("Supabase client initialized.");

Deno.serve(async (req) => {
  console.log("Edge Function triggered");
  const origin = req.headers.get("origin"); // ← 抓來源

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }
  
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  console.log("Action param received:", action);

  if (!action) {
    return respond({ error: "Missing 'action' parameter" }, 400, origin);
  }

  if (action === "weather") {
    const city = url.searchParams.get("city");
    console.log("Weather action - city param:", city);

    if (!city) {
      return respond({ error: "Missing 'city' parameter" }, 400, origin);
    }

    const API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    console.log("Loaded weather API key?", !!API_KEY);

    if (!API_KEY) {
      return respond(
        {
          error: "OPENWEATHER_API_KEY is not set",
          hint: "Use `supabase secrets set OPENWEATHER_API_KEY=your_key`",
        },
        500,
        origin
      );
    }

    try {
      console.log("Fetching weather data...");
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      console.log("Weather API response:", data);

      if (!res.ok) {
        return respond(
          { error: data?.message || "Weather fetch failed" },
          res.status,
          origin
        );
      }

      return respond({ city, data }, 200, origin);
    } catch (err) {
      console.error("Weather fetch error:", err);
      return respond({ error: err.message || String(err) }, 500, origin);
    }
  }

  if (action === "draw-lottery") {
    console.log("draw-lottery action triggered");

    try {
      // Fetch all fortune templates from the DB
      const { data: fortunes, error: fortuneError } = await supabase
        .from("fortune_templates")
        .select("id, result, message, weight");

      if (fortuneError || !fortunes || fortunes.length === 0) {
        console.error("Failed to fetch fortune templates:", fortuneError);
        return respond({ error: "No fortune templates found." }, 500, origin);
      }

      console.log(`Loaded ${fortunes.length} fortune templates`);

      // Build a weighted array pool
      const weightedPool = fortunes.flatMap((f) =>
        Array(f.weight || 1).fill(f)
      );

      if (weightedPool.length === 0) {
        return respond({ error: "No weighted items to draw from." }, 500, origin);
      }

      const chosen =
        weightedPool[Math.floor(Math.random() * weightedPool.length)];
      console.log("Selected fortune:", chosen);

      // Try to identify user via Authorization Bearer token
      const authHeader = req.headers.get("Authorization");
      let user_id: string | null = null;
      let email: string | null = null;

      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(token);

        if (!error && user) {
          user_id = user.id;
          email = user.email;
          console.log("User identified:", { user_id, email });
        } else {
          console.warn("No valid user from token:", error);
        }
      }

      // Save draw result to history
      const { error: insertError } = await supabase
        .from("draw_history")
        .insert({
          user_id,
          email,
          result: chosen.result,
          message: chosen.message,
        });

      if (insertError) {
        console.error("Failed to insert draw history:", insertError);
        return respond({ error: "Failed to save draw history" }, 500, origin);
      }

      console.log("Draw history saved");

      // Return draw result
      return respond({
        result: chosen.result,
        message: chosen.message,
        created_at: new Date().toISOString(),
      }, 200, origin);
    } catch (err) {
      console.error("Unexpected error in draw-lottery:", err);
      return respond({ error: err?.message || "Unexpected error" }, 500, origin);
    }
  }

  console.warn("Unknown action received:", action);
  return respond({ error: `Unknown action: ${action}` }, 400, origin);
});

function respond(body: any, status = 200, origin?: string | null): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: corsHeaders(origin || null),
  });
}

function corsHeaders(origin: string | null) {
  const allowedOrigins = [
    "https://supabase-fortune-shrine.vercel.app",
  ];

  const allow = allowedOrigins.includes(origin || "") ? origin : "null";

  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };
}