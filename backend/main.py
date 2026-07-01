from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import company, job
from backend.database import engine, Base

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TalentSpark API", version="1.0.0")

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(company.router)
app.include_router(job.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to TalentSpark API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
