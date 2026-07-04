export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  user_query: string;
  session_id?: string | null;
}

export interface ChatResponse {
  response: string;
}
