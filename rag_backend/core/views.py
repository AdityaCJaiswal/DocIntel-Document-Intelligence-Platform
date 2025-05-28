from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from .models import Document
from .serializers import DocumentUploadSerializer
from .rag_utils import process_document  # we'll create this next

class DocumentUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        serializer = DocumentUploadSerializer(data=request.data)
        if serializer.is_valid():
            document = serializer.save()
            process_document(document)  # extract, chunk, save
            return Response({'message': 'Document uploaded and processed successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
