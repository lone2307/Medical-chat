from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List
import os
from dotenv import load_dotenv
import chromadb
from settings import *
from dataset_cleaning import cleaned
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from langchain_google_genai import ChatGoogleGenerativeAI
from pymongo import MongoClient
import os

load_dotenv('.env')
API_KEY = os.getenv('GOOGLE_API_KEY')

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["chat_app"]
users = db["users"]


dataset = cleaned()

splitter = RecursiveCharacterTextSplitter(chunk_size = 300, chunk_overlap  = 50)
dataset = splitter.split_text(text=dataset)
data_chunk = []
for idx, dset in enumerate(dataset):
    chunk = {
        "id" : f"{DATASET_NAME}_{idx}"  ,
        "document": dset,
    }
    data_chunk.append(chunk)

# Embedding chunks
embed_model = SentenceTransformer(EMBEDDING_MODEL)
embedding = embed_model.encode(data_chunk)

# Init model
chat_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)

# ChromaDB for fetching chunks of text
client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(COLLECTION_NAME)

# Store into Chroma DB
for i, chunk in enumerate(data_chunk):
    collection.add(
        documents=[chunk['document']],
        ids=[chunk['id']],
        embeddings=[embedding[i]],
        metadatas={"source": 'source'}
    )

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str

class ChatRequest(BaseModel):
    username: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    history: List[dict]

# === Routes ===
@app.post("/login")
def login(req: LoginRequest):
    user = users.find_one({"username": req.username})
    if not user:
        users.insert_one({"username": req.username, "history": []})
        return {"message": "New user created", "history": []}
    return {"message": "Welcome back", "history": user["history"]}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    user = users.find_one({"username": req.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    history = user["history"]
    last_five = history[-5:]

    results = collection.query(
        query_texts=[req.message],
        n_results=5
    )
    retrieved_chunks = results["documents"][0]

    # Build context
    context = "\n".join([f"{h['role']}: {h['content']}" for h in last_five])
    prompt = f"You are a doctor, use the context to answer the question from the user. If the question is not related to medical knowledge, dont response\nContext: {retrieved_chunks}\nConversation so far:\n{context}\nUser: {req.message}\nAssistant:"

    reply = chat_model.invoke(prompt).content

    # Save new messages
    history.append({"role": "user", "content": req.message})
    history.append({"role": "assistant", "content": reply})

    users.update_one({"username": req.username}, {"$set": {"history": history}})

    return {"reply": reply, "history": history}



# Authentication

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt

# Secret for JWT
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

# Mock user
fake_user = {
    "username": "testuser",
    "password": "password123"
}

class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != fake_user["username"] or form_data.password != fake_user["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": form_data.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}
