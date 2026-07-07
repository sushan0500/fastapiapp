import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../Services/ChatService";
import type { ChatMessage } from "../types/chat";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";

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
            content: "Hello! I'm your TalentSpark AI assistant. I can help you with:\n\n- **Job search** - Find the perfect position for your skills\n- **Company research** - Get insights about potential employers\n- **Resume tips** - Improve your resume for better results\n- **Interview prep** - Practice common interview questions\n- **Career advice** - Get guidance on your career path\n\nWhat would you like to know? 🚀",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        } catch (error: any) {
            let errorMessage = "Sorry, I could not reach the chatbot service right now. Please try again later.";
            
            // Provide more specific error messages
            if (error.response?.status === 500) {
                errorMessage = "The server encountered an error. This might be due to a missing or invalid API key. Please check the backend configuration.";
            } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
                errorMessage = "Network Error: Unable to connect to the server. Please ensure the backend is running on http://127.0.0.1:8000";
            }
            
            const fallback: ChatMessage = {
                id: `${Date.now()}-error`,
                role: "assistant",
                content: errorMessage,
            };
            setMessages((prev) => [...prev, fallback]);
            console.error("Chat error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([
            {
                id: "welcome",
                role: "assistant",
                content: "Hello! I'm your TalentSpark AI assistant. I can help you with:\n\n- **Job search** - Find the perfect position for your skills\n- **Company research** - Get insights about potential employers\n- **Resume tips** - Improve your resume for better results\n- **Interview prep** - Practice common interview questions\n- **Career advice** - Get guidance on your career path\n\nWhat would you like to know? 🚀",
            },
        ]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2 className="chat-title">AI Assistant</h2>
                <div className="chat-status">
                    <span className="chat-status-dot"></span>
                    <span>Online</span>
                </div>
            </div>
            <div className="chat-messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.role === "user" ? "message-user" : "message-assistant"}`}
                    >
                        {message.role === "user" ? (
                            message.content
                        ) : (
                            <ReactMarkdown
                                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                                components={{
                                    p: ({ children }) => <p style={{ margin: "4px 0" }}>{children}</p>,
                                    ul: ({ children }) => <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>{children}</ul>,
                                    ol: ({ children }) => <ol style={{ margin: "8px 0", paddingLeft: "20px" }}>{children}</ol>,
                                    li: ({ children }) => <li style={{ marginBottom: "4px" }}>{children}</li>,
                                    code: ({ children, className }) => {
                                        const isBlock = className?.includes("language-");
                                        if (isBlock) {
                                            return (
                                                <pre style={{
                                                    background: "var(--surface-alt)",
                                                    padding: "12px",
                                                    borderRadius: "8px",
                                                    overflow: "auto",
                                                    margin: "8px 0",
                                                    fontSize: "13px"
                                                }}>
                                                    <code className={className}>{children}</code>
                                                </pre>
                                            );
                                        }
                                        return (
                                            <code style={{
                                                background: "var(--surface-alt)",
                                                padding: "2px 6px",
                                                borderRadius: "4px",
                                                fontSize: "13px"
                                            }}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    a: ({ children, href }) => (
                                        <a href={href} style={{ color: "var(--primary)" }} target="_blank" rel="noopener noreferrer">
                                            {children}
                                        </a>
                                    ),
                                    strong: ({ children }) => <strong style={{ color: "var(--primary)" }}>{children}</strong>,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="message message-assistant">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message and press Enter..."
                    className="chat-input"
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="btn btn-primary"
                    style={{ minWidth: "100px" }}
                >
                    {loading ? "Sending..." : "Send"}
                </button>
                <button onClick={handleClear} className="btn btn-secondary">
                    🗑️ Clear
                </button>
            </div>
        </div>
    );
}

export default Chat;