import uvicorn
import cv2
import numpy as np
import uuid
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from module.person_detector import detect_person, visualize_and_save
from database.schema import save_detection_to_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/v1/person_detection")
async def detect_person_api(image: UploadFile = File(...)):
    try:
        image = await image.read()
        image = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR)
    except Exception as e:
        return HTTPException(status_code=400, detail="Not a valid image")
    bboxes, vbboxes = detect_person(image)
    request_id = str(uuid.uuid4())
    output_filename = f"{request_id}.jpg"
    output_path = visualize_and_save(image, bboxes, vbboxes, "./outputs", output_filename)
    save_detection_to_db(len(bboxes), output_path)
    return {"bboxes": bboxes.tolist(), "vbboxes": vbboxes.tolist(), "people_count": len(bboxes)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)