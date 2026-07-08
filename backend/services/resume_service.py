import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

ROOT_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = ROOT_DIR / ".env"
# Load .env if it exists, but don't raise at import time — fail later when needed.
if ENV_PATH.exists():
    load_dotenv(str(ENV_PATH), override=True)

resume_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a professional resume analyser.
Analyse the given resume text and provide:
1. Key skills found
2. Experience level (junior, mid-level, senior)
3. Strengths
4. Areas to Improve
5. Suggested job roles
keep the analysis short and structured."""),
    ("human", "{resume_text}")
])

_resume_chain = None


def get_resume_chain():
    global _resume_chain
    if _resume_chain is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError(
                "Missing GROQ_API_KEY environment variable. Set it in .env or the environment before starting the app."
            )
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=api_key,
            temperature=0.3,
        )
        _resume_chain = resume_prompt | llm
    return _resume_chain


def analyse_resume(resume_text: str) -> str:
    resume_chain = get_resume_chain()
    response = resume_chain.invoke({"resume_text": resume_text})
    return response.content if hasattr(response, "content") else str(response)


