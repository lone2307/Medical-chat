from urllib import response
import google.generativeai as genai
import chromadb
from settings import *
from dataset_cleaning import cleaned
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import pickle
import json


API_KEY = input("API: ")

# Generate clean dataset
dataset = cleaned()

# Splitting dataset
splitter = RecursiveCharacterTextSplitter(chunk_size = 300, overlap = 50)
dataset = splitter.split_text(dataset)

# Chunking data
data_chunk = []
for idx, dset in enumerate(dataset):
    chunk = {
        "id" : f"{DATASET_NAME}_{idx}",
        "document": dset,
    }
    data_chunk.append(chunk)

# Embedding chunks
embed_model = SentenceTransformer(EMBEDDING_MODEL)
embedding = embed_model.encode(data_chunk)

# Init model
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel()

# Get query (example)
query = "Im 80kg and I want to reduce my weight to 70kg, what should I do"

# ChromaDB for fetching chunks of text
client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(COLLECTION_NAME)

# Store into Chroma DB
for i, chunk in enumerate(data_chunk):
    collection.add(
        documents=[chunk['text']],
        ids=[chunk['id']],
        embeddings=[embedding[i]],
        metadata={"source": chunk['source']}
    )

results = collection.query(
    query_texts=[query],
    n_results=5
)
retrieved_chunks = results["documents"][0]

# Setting up prompt 
context = "\n".join(retrieved_chunks)
prompt =f"""
Use the following context to answer the question:

Context:
{context}

Question: {query}

Answer:

"""

# Response
response = model.generate_content(prompt)
print(prompt)
print(response.text)