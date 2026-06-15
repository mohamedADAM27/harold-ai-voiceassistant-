import os
from dotenv import load_dotenv

import google.generativeai as genai
from pydantic import BaseModel

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles


# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Check if API key exists
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")


# Create FastAPI app
app = FastAPI()


# Templates
templates = Jinja2Templates(directory="templates")


# Static files
app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


# Request model for chat endpoint
class ChatRequest(BaseModel):
    message: str


# Home page route
@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )


# Gemini chat endpoint
@app.post("/chat")
async def chat(data: ChatRequest):
    try:
        response = model.generate_content(data.message)

        return {
            "response": response.text
        }

    except Exception as e:
        return {
            "error": str(e)
        }