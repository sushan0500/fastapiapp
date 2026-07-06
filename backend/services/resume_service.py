import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
load_dotenv()
llm = ChatGroq(
    model = "llama-3.3-70b-versatile",
    api_key = os.getenv("GROQ_API_KEY"),
    temperature = 0.3,

)
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

resume_chain = resume_prompt | llm

def analyse_resume(resume_text: str) -> str:
    response = resume_chain.run({"resume_text": resume_text})
    return response.content


