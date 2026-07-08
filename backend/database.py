import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker, AsyncSession
from sqlalchemy.orm import  declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql+asyncpg://postgres:Akrithi%40123@localhost:5432/student_db"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://",1)
async_engine = create_async_engine(DATABASE_URL)
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=async_engine,    expire_on_commit=False)
Base = declarative_base()

if "superbase.com" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]
    async_engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"sslmode": "require"})
else:
    engine = create_async_engine(DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
Base = declarative_base()

async def get_db():
    async with SessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()