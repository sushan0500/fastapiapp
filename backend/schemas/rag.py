from pydantic import BaseModel
from typing import List


class ResumeRequest(BaseModel):
    resume_text: str


class ResumeResponse(BaseModel):
    analysis: str


class JobMatchRequest(BaseModel):
    skills: str
    experience: str


class JobMatchResult(BaseModel):
    job_id: int
    title: str
    description: str
    salary: int
    score: float


class JobMatchResponse(BaseModel):
    matches: List[JobMatchResult]


class RagSearchRequest(BaseModel):
    question: str


class RagSearchResponse(BaseModel):
    answer: str


class JobSearchRequest(BaseModel):
    query: str


class SemanticSearchResult(BaseModel):
    job_id: int
    title: str
    description: str
    salary: int
    score: float


class SemanticSearchResponse(BaseModel):
    results: List[SemanticSearchResult]


class EmbedResponse(BaseModel):
    message: str
    count: int


#                     Client
#                       │
#           HTTP POST Request (JSON)
#                       │
#                       ▼
#               FastAPI Router
#                       │
#       ┌───────────────┼──────────────────┐
#       │               │                  │
#       ▼               ▼                  ▼
#  Resume API      Search API        RAG API
#       │               │                  │
#       ▼               ▼                  ▼
#  Resume Service  Qdrant Service    RAG Service
#       │               │                  │
#       ▼               ▼                  ▼
#     Groq          Vector Search     Groq + Qdrant
#                       │
#                       ▼
#               Pydantic Response
#                       │
#                       ▼
#                JSON Response
#                       │
#                       ▼
#                    Frontend

# | Endpoint                       | Purpose                                                                                                                  | Service Called             |
# | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
# | **POST `/rag/embed-jobs`**     | Reads all jobs from PostgreSQL, generates embeddings, and stores them in Qdrant.                                         | `embed_all_jobs()`         |
# | **POST `/rag/search`**         | Performs semantic search using a natural-language query and returns the top matching jobs.                               | `search_jobs()`            |
# | **POST `/rag/ask`**            | Executes the full RAG pipeline: retrieve relevant jobs from Qdrant and generate a natural-language answer using the LLM. | `rag_job_search()`         |
# | **POST `/rag/analyse-resume`** | Sends resume text to the LLM and returns a structured resume analysis.                                                   | `analyse_resume()`         |
# | **POST `/rag/job-match`**      | Matches a candidate's skills and experience against stored job embeddings and returns the best matching jobs.            | `match_jobs_for_profile()` |