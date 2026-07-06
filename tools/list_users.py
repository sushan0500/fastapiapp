from backend.database import SessionLocal
from backend.models.users import User

def main():
    db = SessionLocal()
    users = db.query(User).all()
    for u in users:
        print(u.id, u.username, u.email)
    db.close()

if __name__ == '__main__':
    main()
