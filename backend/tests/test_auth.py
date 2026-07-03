import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.database import Base
from backend.models.users import User
from backend.routers.auth import register
from backend.schemas.users import UserCreate
from fastapi import HTTPException


class RegisterAuthTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        self.Session = sessionmaker(bind=self.engine)
        Base.metadata.drop_all(bind=self.engine)
        Base.metadata.create_all(bind=self.engine)

    def test_register_rejects_duplicate_username(self):
        db = self.Session()
        try:
            first_user = User(
                username="abc",
                email="abc@example.com",
                hashed_password="hashed",
                role="fullstack",
            )
            db.add(first_user)
            db.commit()

            duplicate_user = UserCreate(
                name="abc",
                email="different@example.com",
                password="Abc@123",
                role="fullstack",
            )

            with self.assertRaises(HTTPException) as context:
                register(duplicate_user, db=db)

            self.assertEqual(context.exception.status_code, 400)
            self.assertIn("already exists", str(context.exception.detail).lower())
        finally:
            db.close()


if __name__ == "__main__":
    unittest.main()
