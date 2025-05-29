from django.urls import path
from .views import DocumentUploadView,DocumentListView, DocumentDetailView, DocumentDeleteView, ChatSessionDetailView
from .views import ask_question

urlpatterns = [
    path('upload/', DocumentUploadView.as_view(), name='upload-document'),
    path('ask/', ask_question, name='ask-question'),
    path('documents/', DocumentListView.as_view(), name='document-list'),
    path('documents/<int:pk>/', DocumentDetailView.as_view(), name='document-detail'),
    path('documents/<int:pk>/delete/', DocumentDeleteView.as_view(), name='document-delete'),
    path('sessions/<int:pk>/', ChatSessionDetailView.as_view(), name='chat-session-detail')

]