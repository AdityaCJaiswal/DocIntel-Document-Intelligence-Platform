from django.urls import path
from .views import DocumentUploadView,DocumentListView, DocumentDetailView, DocumentDeleteView, ChatSessionDetailView, DocumentChunkListView
from .views import ask_question, chat_history
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse

# CSRF protection views
@csrf_protect
def csrf_token_view(request):
    return JsonResponse({'message': 'CSRF cookie set'})

@csrf_protect
def csrf_cookie_view(request):
    return JsonResponse({'message': 'CSRF cookie set'})

# URL patterns for document management and chat functionality
urlpatterns = [ 
    # Document operations
    path('upload/', DocumentUploadView.as_view(), name='upload-document'),
    path('documents/', DocumentListView.as_view(), name='document-list'),
    path('documents/<int:pk>/', DocumentDetailView.as_view(), name='document-detail'),
    path('documents/<int:pk>/delete/', DocumentDeleteView.as_view(), name='document-delete'),
    path('documents/<int:document_id>/chunks/', DocumentChunkListView.as_view(), name='document-chunks'),
    
    # Chat functionality
    path('ask/', ask_question, name='ask-question'),
    path('sessions/<int:pk>/', ChatSessionDetailView.as_view(), name='chat-session-detail'),
    path('documents/<int:document_id>/chat-history/', chat_history, name='chat-history'),
    
    # Security
    path("api/csrf/", csrf_cookie_view),
    path('csrf/', csrf_token_view),
]

