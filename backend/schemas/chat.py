from pydantic import BaseModel


class ChatRequest(BaseModel):
    user_query: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    response: str
