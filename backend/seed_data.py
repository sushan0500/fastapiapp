from backend.database import SessionLocal
from backend.models.company import Company
from backend.models.job import Job
from backend.models.users import User
from backend.utils.security import hash_password


def seed():
    db = SessionLocal()
    try:
        if db.query(Company).count() == 0:
            companies = [
                Company(name='TechNova', email='hr@technova.com', phone='1111111111', location='New York'),
                Company(name='DataForge', email='careers@dataforge.com', phone='2222222222', location='San Francisco'),
            ]
            db.add_all(companies)
            db.commit()
            db.refresh(companies[0])
            db.refresh(companies[1])

        if db.query(Job).count() == 0:
            company_ids = [c.id for c in db.query(Company).all()]
            jobs = [
                Job(title='Backend Developer', description='FastAPI role', salary=120000, company_id=company_ids[0]),
                Job(title='Frontend Developer', description='React role', salary=110000, company_id=company_ids[1]),
            ]
            db.add_all(jobs)
            db.commit()

        if db.query(User).count() == 0:
            user = User(
                username='admin',
                email='admin@example.com',
                hashed_password=hash_password('admin123'),
                role='Admin'
            )
            db.add(user)
            db.commit()
    finally:
        db.close()


if __name__ == '__main__':
    seed()
    print('Seed data inserted')
