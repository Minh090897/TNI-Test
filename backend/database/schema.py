from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta, timezone

# Create database engine
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/people_counter"
engine = create_engine(DATABASE_URL)

Base = declarative_base()

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone(timedelta(hours=7))))
    num_people = Column(Integer)
    image_path = Column(String)
    
# Create tables
Base.metadata.create_all(bind=engine)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def save_detection_to_db(num_people: int, image_path: str):
    """Save detection results to database"""
    db = SessionLocal()
    try:

        detection = Detection(
            num_people=num_people,
            image_path=image_path
        )
        db.add(detection)
        db.commit()
        db.refresh(detection)
        return detection
    finally:
        db.close()
