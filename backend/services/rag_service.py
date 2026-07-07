import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from backend.services.qdrant_service import search_jobs

ROOT_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = ROOT_DIR / ".env"
if not ENV_PATH.exists():
    raise RuntimeError(f'Missing .env file at {ENV_PATH}')
load_dotenv(str(ENV_PATH), override=True)

rag_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are a job search assistant. Use the following job descriptions to answer the user's query. If the answer is not contained within the job descriptions, respond with 'I don't know.'",
    ),
    ("system", "Retrieved Jobs:{context}"),
    ("human", "{question}"),
])

_rag_chain = None


def get_rag_chain():
    global _rag_chain
    if _rag_chain is None:
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
        _rag_chain = rag_prompt | llm
    return _rag_chain


def rag_job_search(query: str, top_k: int = 5) -> str:
    result = search_jobs(query, top_k)
    if not result:
        return "No jobs found in the database. please embed jobs first using the /rag/embed-jobs endpoint."

    context = "\n".join([
        f" - {r['title']}: {r['description']} (Salary: {r['salary']}, Match: {r['score']})"
        for r in result
    ])
    response = get_rag_chain().invoke({"context": context, "question": query})
    return response.content if hasattr(response, "content") else str(response)
