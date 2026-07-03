from backend.database import Base, engine
from backend.models import company, job, users

print('engine url:', engine.url)
Base.metadata.create_all(bind=engine)
print('created tables')
