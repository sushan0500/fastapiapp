from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    email: str
    password: str
    role: str


class UserCreate(UserBase):
    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "abc",
                "email": "abc@gmail.com",
                "password": "Abc@123",
                "role": "fullstack"
            }
        }
    }


class UserUpdate(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": 1
            }
        }
    }


class LoginUser(BaseModel):
    email: str
    password: str
