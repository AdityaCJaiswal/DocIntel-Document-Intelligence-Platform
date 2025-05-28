from rest_framework import serializers
from .models import Document

class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
