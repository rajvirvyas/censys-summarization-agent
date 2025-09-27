from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict
import os
import requests
from dotenv import load_dotenv

load_dotenv()

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

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


def engineer_prompt(data): # i can tweak this later to improve output
    return f"""
    You are a cybersecurity analyst. Summarize the following Censys host data:

    {data}

    Summarize in one bullet point per metric, highlighting any services, vulnerabilities, and risks.
    """

def call_groq_api(prompt):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": "You are a skilled cybersecurity analyst. Summarize the Censys host data. Highlight any unusual services, open ports, vulnerabilities, or potential security risks. Use a professional and concise tone."
            },
            
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post(url, headers = headers, json = payload)
    response.raise_for_status()
    result = response.json()

    return result["choices"][0]["message"]["content"].strip()

# @app.get("/")
# def root():
#     return {"message": "API is set up!"}

@app.post("/summarize")
async def summarize_data(payload: HostData):
    data = payload.data
    prompt = engineer_prompt(data)
    summary = call_groq_api(prompt)

    return {"summary": summary} 
