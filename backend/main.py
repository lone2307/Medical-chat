from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chatbot import ChatBot

chatbot = ChatBot()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(chat: Message):
    query = chat.message
    chat = chatbot.getChat(query)

    return {"response": f"{chat}"}