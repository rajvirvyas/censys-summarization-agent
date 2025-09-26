from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], # will restrict later
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class HostData(BaseModel):
    data: Dict[str, Any] # based on the json file

@app.get("/")
def root():
    return {"message": "API is set up!"}

@app.post("/summarize")
def summarize_data(payload: HostData):
    data = payload.data
    return {"summary": "Insert summary here", "raw": data} # planning on using llm to summarize the data
