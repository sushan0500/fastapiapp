from fastapi.testclient import TestClient
from backend.app.main import app
from backend.database import SessionLocal
from backend.models.job import Job
from backend.models.company import Company

with SessionLocal() as db:
    invalid_jobs = db.query(Job).filter(Job.company_id == None).all()
    print('invalid job count', len(invalid_jobs))
    for job in invalid_jobs:
        print('invalid job', job.id, job.title, job.company_id)
    companies = db.query(Company).all()
    print('companies count', len(companies), 'company ids', [c.id for c in companies])

client = TestClient(app)
resp = client.get('/job/')
print('status', resp.status_code)
print(resp.json())
