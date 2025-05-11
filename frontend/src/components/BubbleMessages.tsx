import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { FortuneResult } from "../types";

interface Props {
  userEmail: string | null;
}

export const BubbleMessages: React.FC<Props> = ({ userEmail }) => {
  const [messages, setMessages] = useState<FortuneResult[]>([]);

  const fetchMessages = useCallback(async () => {
    let query = supabase
      .from("draw_history")
      .select("email, result, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
  
    if (userEmail) {
      query = query.eq("email", userEmail);
    }
  
    const { data, error } = await query;
  
    if (error) {
      console.error("[Supabase] Failed to fetch messages:", error);
    } else {
      setMessages(data || []);
    }
  }, [userEmail]);
   

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return (
    <div className="container mt-4">
      {messages.map((msg, idx) => (
        <div key={idx} className="alert alert-info p-2 mb-2">
          <strong>{msg.email ? msg.email.split("@")[0] : "guest"}:</strong>{" "}
          drew "<strong>{msg.result}</strong>" – {msg.message}
        </div>
      ))}
    </div>
  );
};
