import os

from groq import Groq

API_KEY = os.getenv("GROQ_API_KEY", "").strip()
LLAMA_MODEL = "llama-3.3-70b-versatile"

client = Groq(api_key=API_KEY) if API_KEY else None
store = {}


def chat_without_memory(user_query: str):
    return _generate_reply(user_query, session_id=None)


def _generate_reply(user_query: str, session_id: str | None = None) -> str:
    if client is None:
        return "The Groq API key is not configured. Set the GROQ_API_KEY environment variable and restart the app."

    history = []
    if session_id is not None and session_id in store:
        history = store[session_id]

    messages = []
    if history:
        messages.append({
            "role": "system",
            "content": "You are a helpful assistant. Keep answers concise and useful."
        })
        for item in history:
            messages.append({"role": "user", "content": item})
            messages.append({"role": "assistant", "content": "I remember that."})

    messages.append({"role": "user", "content": user_query})

    response = client.chat.completions.create(
        model=LLAMA_MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=300,
    )

    reply = response.choices[0].message.content.strip()
    if session_id is not None:
        store[session_id].append(user_query)
        store[session_id].append(reply)
    return reply


def invoke_chain_with_memory(user_query: str, session_id: str = "user1"):
    if session_id not in store:
        store[session_id] = []
    return _generate_reply(user_query, session_id=session_id)
