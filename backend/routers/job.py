from select import select
from unittest import result
from django import db
from sqlalchemy.future import select
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.job import Job
from models.company import Company
from sqlalchemy.ext.asyncio import AsyncSession
from utils.oauth2 import get_current_user, role_required
from schemas.job import JobCreate, JobUpdate, JobResponse

router = APIRouter(prefix="/job", tags=["job"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=JobResponse)
async def create_job(
    job: JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(role_required(["admin", "hr"]))
):
    result = await db.execute(
        select(Company).where(Company.id == job.company_id)
    )
    company = result.scalar_one_or_none()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company not found"
        )

    db_job = Job(**job.dict())

    db.add(db_job)

    await db.commit()

    await db.refresh(db_job)

    return db_job

@router.get("", status_code=status.HTTP_200_OK, response_model=list[JobResponse])
async def get_all_job(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Job))
    jobs = result.scalars().all()
    return jobs

@router.get("/{job_id}", status_code=status.HTTP_200_OK, response_model=JobResponse)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Job not found")
    return job

@router.put("/{job_id}", status_code=status.HTTP_201_CREATED, response_model=JobResponse)
async def update_job(job_id: int, job: JobUpdate, db: AsyncSession = Depends(get_db), current_user = Depends(role_required(["admin", "hr"]))):
    result = await db.execute(select(Job).where(Job.id == job_id))
    db_job = result.scalar_one_or_none()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Job not found")
    if job.company_id is not None:
        result = await db.execute(select(Company).where(Company.id == job.company_id))
        company = result.scalar_one_or_none()
        if not company:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company not found")
    for key, value in job.dict().items():
        if value is not None:
            setattr(db_job, key, value)
    await db.commit()
    await db.refresh(db_job)
    return db_job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(role_required(["admin","hr"]))):
    result = await db.execute(select(Job).where(Job.id == job_id))
    db_job = result.scalar_one_or_none()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Job not found")
    await db.delete(db_job)
    await db.commit()
    return {"message": "Job deleted successfully"}




# @router.get("/")
# def read_job():
#     return {"job": "Job root"}

# @router.get("/{job_id}")
# def read_job(job_id: int):
#     return {"job_id": job_id}