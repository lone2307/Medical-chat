import fitz
import re
from settings import *


def extract_text_from_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def clean_pdf_text(text):
    text = re.sub(r'-\n', '', text)  # fix hyphenated words
    text = re.sub(r'\n', ' ', text)  # remove newlines
    text = re.sub(r'\s+', ' ', text) # normalize spaces
    return text.strip()

def cleaned():
    text = extract_text_from_pdf(RAW_PDF_PATH)
    text = clean_pdf_text(text)
    return text