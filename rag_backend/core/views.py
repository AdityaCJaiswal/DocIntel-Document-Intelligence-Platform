from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.generics import DestroyAPIView
from .models import Document, Chunk, ChatSession, ChatMessage
from .rag_utils import process_document, doc_embeddings_map, model, index

import numpy as np
import os
import requests


from .serializers import DocumentSerializer
from rest_framework.generics import ListAPIView, RetrieveAPIView

class DocumentListView(ListAPIView):
    queryset = Document.objects.all().order_by('-created_at')
    serializer_class = DocumentSerializer

class DocumentDetailView(RetrieveAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class DocumentUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES['file']
        serializer = DocumentSerializer(data={'file': file, 'title': file.name})
        if serializer.is_valid():
            document = serializer.save(title=file.name)
            process_document(document)
            return Response({'message': 'Document uploaded and processed successfully', 'document_id': document.id})
        return Response(serializer.errors, status=400)

class DocumentDeleteView(DestroyAPIView):
    queryset = Document.objects.all()

    def delete(self, request, *args, **kwargs):
        doc_id = kwargs.get('pk')
        try:
            document = Document.objects.get(id=doc_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found."}, status=404)

        # Delete related chunks
        Chunk.objects.filter(document=document).delete()

        # Delete local file
        if document.file and os.path.exists(document.file.path):
            os.remove(document.file.path)

        # Remove from FAISS & memory (MVP approach: clear all)
        from .rag_utils import index, doc_embeddings_map
        index.reset()
        doc_embeddings_map.clear()

        document.delete()
        return Response({"message": f"Document {doc_id} and all associated data deleted."})

@api_view(['POST'])
def ask_question(request):
    try:
        document_id = int(request.data.get("document_id"))
        question = request.data.get("question")
    except (TypeError, ValueError):
        return Response({"error": "Invalid or missing document_id/question"}, status=400)

    print(f"[ASK] Looking up document_id = {document_id}")
    print(f"[ASK] doc_embeddings_map keys = {list(doc_embeddings_map.keys())}")

    if document_id not in doc_embeddings_map:
        return Response({"error": "Document embeddings not found in memory. Try re-uploading."}, status=500)

    # Step 1: Embed the question
    question_embedding = model.encode(question)
    question_embedding = np.array([question_embedding]).astype("float32")

    # Step 2: Search in FAISS
    D, I = index.search(question_embedding, k=3)
    chunks = doc_embeddings_map[document_id]["chunks"]
    matched_chunks = [chunks[i] for i in I[0]]

    # Step 3: Build the prompt
    context = "\n\n".join(matched_chunks)
    prompt = f"""You are an AI assistant. Use the context below to answer the question.

Context:
{context}

Question: {question}
Answer:"""

    # Step 4: Call OpenAI API


    try:
        lm_response = requests.post(
            "http://localhost:1234/v1/chat/completions",
            headers={"Content-Type": "application/json"},
            json={
                "model": "local-model",  # LM Studio uses your active chat model
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3
            }
        )
        response_json = lm_response.json()
        answer = response_json['choices'][0]['message']['content'].strip()
        # Create or reuse a chat session
        session_id = request.data.get("session_id")
        if session_id:
            session, _ = ChatSession.objects.get_or_create(id=session_id, document_id=document_id)
        else:
            session = ChatSession.objects.create(document_id=document_id)

        # Save the chat message
        ChatMessage.objects.create(
            session=session,
            question=question,
            answer=answer
        )

        return Response({
            "answer": answer,
            "session_id": session.id
        })

    
    except Exception as e:
        print(f"[ERROR] LM Studio call failed: {e}")
        return Response({"error": f"LM Studio error: {str(e)}"}, status=500) 
    

