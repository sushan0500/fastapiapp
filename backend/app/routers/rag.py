import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.services.resume_service import analyse_resume

router = APIRouter(prefix="/rag", tags=["rag"])

class ResumeRequest(BaseModel):
    resume_text: str

@router.post("/analyse-resume")
async def analyse_resume_endpoint(request: ResumeRequest):
    try:
        analysis = analyse_resume(request.resume_text)
        return {"analysis": analysis}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
