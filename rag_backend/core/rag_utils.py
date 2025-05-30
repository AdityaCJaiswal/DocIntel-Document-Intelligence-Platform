import os
import pdfplumber
from docx import Document as DocxDocument
from .models import Chunk, DocumentChunk
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss


model = SentenceTransformer('all-MiniLM-L6-v2')

# Global FAISS index (in memory for now)
embedding_dim = 384  # all-MiniLM-L6-v2 uses 384-dimensional vectors
index = faiss.IndexFlatL2(embedding_dim)

# This dictionary maps document.id to a list of chunk embeddings (for future use)
doc_embeddings_map = {}

def extract_text(document):
    ext = os.path.splitext(document.file.name)[1].lower()
    path = document.file.path
    text = ""

    if ext == '.pdf':
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
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def process_document(document):
    text = extract_text(document)
    chunks = chunk_text(text)

    embeddings = []
    
    for i, chunk in enumerate(chunks):
        Chunk.objects.create(document=document, content=chunk, chunk_index=i)
        DocumentChunk.objects.create(
            document=document,
            chunk_index=i, 
            page_number=chunk_page_mapping[i],  # or any logic
            content=chunk
        )
        embedding = model.encode(chunk)
        embeddings.append(embedding)

    embeddings_np = np.array(embeddings).astype("float32")
    index.add(embeddings_np)

    # ✅ Print debug info
    print(f"[INFO] Processed {len(chunks)} chunks for document ID {document.id}")
    print(f"[INFO] Embeddings shape: {embeddings_np.shape}")

    doc_embeddings_map[document.id] = {
        "chunks": chunks,
        "embeddings": embeddings_np
    }

    print(f"[INFO] doc_embeddings_map keys: {list(doc_embeddings_map.keys())}")
    document.processing_status = 'processed'
    document.size = os.path.getsize(document.file.path)
    document.file_type = os.path.splitext(document.file.name)[1].replace('.', '')
    document.pages = text.count('\f') + 1 if document.file_type == 'pdf' else None
    document.save()

def process_document(document):
    # Step 1: Extract full text
    text = extract_text(document)

    # Step 2: Split into chunks
    chunks = chunk_text(text)

    embeddings = []

    for i, chunk in enumerate(chunks):
        # Step 3: Save each chunk to the database (no page number mapping for now)
        DocumentChunk.objects.create(
            document=document,
            chunk_index=i,
            page_number=1,  # Default value since mapping is not defined
            content=chunk
        )

        # Step 4: Generate embedding
        embedding = model.encode(chunk)
        embeddings.append(embedding)

    # Step 5: Convert embeddings to NumPy and store in FAISS
    embeddings_np = np.array(embeddings).astype("float32")
    index.add(embeddings_np)

    # Step 6: Store in memory
    doc_embeddings_map[document.id] = {
        "chunks": chunks,
        "embeddings": embeddings_np
    }

    # Step 7: Update document metadata
    document.processing_status = 'processed'
    document.size = os.path.getsize(document.file.path)
    document.file_type = os.path.splitext(document.file.name)[1].replace('.', '')
    document.pages = text.count('\f') + 1 if document.file_type == 'pdf' else None
    document.save()

    # Debug
    print(f"[INFO] Processed {len(chunks)} chunks for document ID {document.id}")
    print(f"[INFO] Embeddings shape: {embeddings_np.shape}")
    print(f"[INFO] doc_embeddings_map keys: {list(doc_embeddings_map.keys())}")
