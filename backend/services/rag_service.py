import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from services.qdrant_service import search_jobs
load_dotenv()
llm = ChatGroq(
    model = "llama-3.3-70b-versatile"
    api_key = os.getenv("GROQ_API_KEY")
    temperature = 0.3,
)
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a job search assistant. Use the following job descriptions to answer the user's query. If the answer is not contained within the job descriptions, respond with 'I don't know.'"),
    ("Retrieved Jobs:{context}"""),
        ("human", "{question}")
])
rag_chain = rag_prompt | llm
def rag_job_search(query: str, top_k: int = 5) -> str:
    result = search_jobs(query, top_k)
    if not result:
        return "No jobs found in the database. please embed jobs first using the /rag/embed-jobs endpoint."
    context = "\n".join([
        f" - {r['title']}: {r['description']} (Salary: {r['salary']}, Match: {r['score']})"
        for r in result 
    ])
    response = rag_chain.run({"context": context, "question": question})
    return response.content