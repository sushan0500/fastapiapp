from fastapi import APIRouter
from backend.schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])


def _get_chat_service():
    from backend.services.langchain_service import invoke_chain_with_memory

    return invoke_chain_with_memory


@router.post("/memory", response_model=ChatResponse)
def chat_with_memory(request: ChatRequest):
    invoke_chain_with_memory = _get_chat_service()
    session_id = request.session_id or "user1"
    response = invoke_chain_with_memory(request.user_query, session_id=session_id)
    return {"response": response.content if hasattr(response, "content") else str(response)}
