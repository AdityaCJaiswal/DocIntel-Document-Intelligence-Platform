import os
import pdfplumber
from docx import Document as DocxDocument
from .models import Chunk
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_text(document):
    ext = os.path.splitext(document.file.name)[1].lower()
    path = document.file.path
    text = ""

    if ext == '.pdf':
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    elif ext == '.docx':
        doc = DocxDocument(path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    elif ext == '.txt':
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
    else:
        raise ValueError("Unsupported file format")

    return text

def chunk_text(text, chunk_size=300, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def process_document(document):
    text = extract_text(document)
    chunks = chunk_text(text)

    for i, chunk in enumerate(chunks):
        Chunk.objects.create(document=document, content=chunk, chunk_index=i)
