from rest_framework import serializers
from .models import Document, ChatSession, ChatMessage, DocumentChunk

# Serializers for converting model instances to JSON and vice versa

# Main document serializer with all fields included
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'


# Serializes individual chat messages within a session
class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'question', 'answer', 'created_at']


# Chat session serializer that includes nested messages
class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)  # Nested message serialization

    class Meta:
        model = ChatSession
        fields = ['id', 'document', 'created_at', 'messages']


# Serializes document chunks with their page and content info
class DocumentChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentChunk
        fields = ['chunk_index', 'page_number', 'content']
