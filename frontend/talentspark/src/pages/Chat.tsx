import { useState } from "react";
import { sendChatMessage } from "../Services/ChatService";
import type { ChatMessage } from "../types/chat";

const STORAGE_SESSION_KEY = "chat_session_id";

function Chat() {
  const [sessionId] = useState<string>(() => {
    try {
      const existing = localStorage.getItem(STORAGE_SESSION_KEY);
      if (existing) return existing;
    } catch (e) {
      /* ignore */
    }
    const newId = `frontend-${Math.random().toString(36).slice(2, 10)}`;
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, newId);
    } catch (e) {
      /* ignore */
    }
    return newId;
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I’m your TalentSpark assistant. Ask me anything.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage({
        user_query: trimmed,
        session_id: sessionId,
      });

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: response.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const fallback: ChatMessage = {
        id: `${Date.now()}-error`,
        role: "assistant",
        content: "Sorry, I could not reach the chatbot service right now.",
      };
      setMessages((prev) => [...prev, fallback]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleClear = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I’m your TalentSpark assistant. Ask me anything.",
      },
    ]);
  };

  return (
    <div style={{ maxWidth: 860, margin: "24px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Chatbot</h2>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 16,
          minHeight: 360,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              background: message.role === "user" ? "#2563eb" : "#f3f4f6",
              color: message.role === "user" ? "#fff" : "#111827",
              padding: "10px 12px",
              borderRadius: 12,
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              position: "relative",
            }}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        <button
          onClick={handleClear}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default Chat;
