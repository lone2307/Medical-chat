import os

RAW_PDF_PATH = os.path.join('dataset', 'raw_pdf.pdf')
DATASET_NAME = "medical"
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"
CHUNK_FILE = "chunks.jsonl"
EMBEDDING_FILE = "embedding.pkl"
CHROMA_PATH = "chroma"
COLLECTION_NAME = "physical_training"