from urllib import response
from dotenv import load_dotenv
import google.generativeai as genai
import chromadb
from settings import *
from dataset_cleaning import cleaned
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer

load_dotenv('.env')
API_KEY = os.getenv('GOOGLE_API_KEY')

# Generate clean dataset
class ChatBot():
    def __init__(self):
        super().__init__()
        # Splitting dataset
        dataset = cleaned()
    
        # Chunking data
        splitter = RecursiveCharacterTextSplitter(chunk_size = 300, chunk_overlap  = 50)
        dataset = splitter.split_text(text=dataset)
        self.data_chunk = []
        for idx, dset in enumerate(dataset):
            chunk = {
                "id" : f"{DATASET_NAME}_{idx}"  ,
                "document": dset,
            }
            self.data_chunk.append(chunk)

        # Embedding chunks
        embed_model = SentenceTransformer(EMBEDDING_MODEL)
        self.embedding = embed_model.encode(self.data_chunk)

        # Init model
        genai.configure(api_key=API_KEY)
        self.model = genai.GenerativeModel()

        # ChromaDB for fetching chunks of text
        client = chromadb.PersistentClient(path=CHROMA_PATH)
        self.collection = client.get_or_create_collection(COLLECTION_NAME)

        # Store into Chroma DB
        for i, chunk in enumerate(self.data_chunk):
            self.collection.add(
                documents=[chunk['document']],
                ids=[chunk['id']],
                embeddings=[self.embedding[i]],
                metadatas={"source": 'source'}
            )

    def getChat(self, query = ""):
        results = self.collection.query(
            query_texts=[query],
            n_results=5
        )
        retrieved_chunks = results["documents"][0]

        # Setting up prompt 
        context = "\n".join(retrieved_chunks)
        prompt =f"""
        You are a doctor, use the context to answer the question from the user. If the question is not related to medical knowledge, dont account for the context and response

        Context:
        {context}

        Question: {query}

        Answer:
        """

        return self.model.generate_content(prompt).text