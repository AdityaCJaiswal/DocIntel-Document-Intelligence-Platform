from django.db import models

# Document model represents an uploaded file with metadata and processing status
class Document(models.Model):
    title = models.CharField(max_length=255)  # Title of the document
    file = models.FileField(upload_to='documents/')  # File upload field
    file_type = models.CharField(max_length=10, blank=True)  # Type/extension of the file
    size = models.IntegerField(null=True, blank=True)  # File size in bytes
    pages = models.IntegerField(null=True, blank=True)  # Number of pages (if applicable)
    processing_status = models.CharField(max_length=50, default='pending')  # Status: pending, processed, failed
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when last updated

    def __str__(self):
        return self.title  # String representation returns the document title

# Chunk model stores a segment of a document's content
class Chunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')  # Link to parent document
    content = models.TextField()  # Text content of the chunk
    chunk_index = models.IntegerField()  # Order/index of the chunk in the document

    def __str__(self):
        return f"Chunk {self.chunk_index} of {self.document.title}"

# ChatSession model represents a chat session related to a document
class ChatSession(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chat_sessions')  # Associated document
    created_at = models.DateTimeField(auto_now_add=True)  # When the session was created

    def __str__(self):
        return f"ChatSession {self.id} for {self.document.title}"

# ChatMessage model stores a question-answer pair within a chat session
class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')  # Parent chat session
    question = models.TextField()  # User's question
    answer = models.TextField()  # System's answer
    created_at = models.DateTimeField(auto_now_add=True)  # When the message was created

    def __str__(self):
        return f"Message {self.id} in Session {self.session.id}"

# DocumentChunk model stores a chunk of a document with page information
class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='docchunks')  # Linked document
    chunk_index = models.IntegerField()  # Index of the chunk
    page_number = models.IntegerField()  # Page number in the document
    content = models.TextField()  # Text content of the chunk

    def __str__(self):
        return f"Chunk {self.chunk_index} (Page {self.page_number}) of {self.document.title}"
