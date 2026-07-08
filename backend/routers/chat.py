from fastapi import APIRouter
from schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])


def _get_chat_service():
    from services.langchain_service import invoke_chain_with_memory

    return invoke_chain_with_memory


@router.post("/memory", response_model=ChatResponse)
def chat_with_memory(request: ChatRequest):
    try:
        invoke_chain_with_memory = _get_chat_service()
        session_id = request.session_id or "user1"
        response = invoke_chain_with_memory(request.user_query, session_id=session_id)
        return {"response": response.content if hasattr(response, "content") else str(response)}
    except Exception as e:
        # Log the error for debugging
        import traceback
        traceback.print_exc()
        # Return a more informative error
        return {"response": f"Server error: {str(e)}"}
