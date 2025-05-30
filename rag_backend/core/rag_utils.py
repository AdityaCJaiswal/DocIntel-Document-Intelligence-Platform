import os
import pdfplumber  # For PDF text extraction
from docx import Document as DocxDocument  # For DOCX text extraction
from .models import Chunk, DocumentChunk
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss

# Load sentence transformer model for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# In-memory FAISS index for vector search
embedding_dim = 384  # Embedding size for the model
index = faiss.IndexFlatL2(embedding_dim)

doc_embeddings_map = {}  # Maps document.id to its chunk embeddings

def extract_text(document):
    ext = os.path.splitext(document.file.name)[1].lower()
    path = document.file.path
    text = ""

    if ext == '.pdf':
        # Extract text from each page of the PDF
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
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
    # Split text into overlapping word chunks
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def process_document(document):
    # Extract text and split into chunks
    text = extract_text(document)
    chunks = chunk_text(text)

    embeddings = []

    for i, chunk in enumerate(chunks):
        # Save each chunk to the database (page_number defaulted to 1)
        DocumentChunk.objects.create(
            document=document,
            chunk_index=i,
            page_number=1,
            content=chunk
        )
        # Generate embedding for the chunk
        embedding = model.encode(chunk)
        embeddings.append(embedding)

    embeddings_np = np.array(embeddings).astype("float32")
    index.add(embeddings_np)

    # Store embeddings and chunks in memory
    doc_embeddings_map[document.id] = {
        "chunks": chunks,
        "embeddings": embeddings_np
    }

    # Update document metadata
    document.processing_status = 'processed'
    document.size = os.path.getsize(document.file.path)
    document.file_type = os.path.splitext(document.file.name)[1].replace('.', '')
    document.pages = text.count('\f') + 1 if document.file_type == 'pdf' else None
    document.save()

    # Debug info
    print(f"[INFO] Processed {len(chunks)} chunks for document ID {document.id}")
    print(f"[INFO] Embeddings shape: {embeddings_np.shape}")
    print(f"[INFO] doc_embeddings_map keys: {list(doc_embeddings_map.keys())}")
