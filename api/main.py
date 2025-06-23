from fastapi import FastAPI,UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import requests

app = FastAPI()
origins =[
    "http://localhost",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# making end point this is how it comes
endpoint = "http://localhost:8502/v1/models/potatodieases-model:predict"

# load the model

CLASS_NAMES = ['Early Blight', 'Late Blight', 'Healthy']

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

# function for convert image to numpy array

def read_file_as_image(data)-> np.ndarray :
    image = np.array(Image.open(BytesIO(data )))
    return image

@app.post("/predict")  
async def predict(file: UploadFile):
  image = read_file_as_image(await file.read())
  

#   this is expecting a batch image for input this is why do this expand_dims
  img_batch = np.expand_dims(image,0)
#   json data 
  json_data = {
        "instances": img_batch.tolist()
    }
  response=requests.post(endpoint,json=json_data)
#   get first element
  prediction =np.array(response.json()["predictions"][0]) 
  pass
#   take first image of batch prediction[0]
  predicted_class=CLASS_NAMES[np.argmax(prediction)]
  confidence = np.max(prediction)
  return {
      "class": predicted_class,
      "confidence": confidence
  } 
   
