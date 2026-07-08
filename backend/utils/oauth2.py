from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from utils.token import verify_access_token
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.users import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    user = verify_access_token(token)
    result = await db.execute(select(User).where(User.id == int(user["sub"])))
    current_user = result.scalars().first()
    if current_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return current_user
    
def role_required(required_roles: list[str]):
    def role_decorator(current_user = Depends(get_current_user)):
        if current_user.role.lower() not in [role.lower() for role in required_roles]:
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user
    return role_decorator
