from django.urls import path

from .views import EmailLogListCreate, SmsLogListCreate, WhatsAppLogListCreate

urlpatterns = [
    path("emails", EmailLogListCreate.as_view(), name="emails"),
    path("sms", SmsLogListCreate.as_view(), name="sms"),
    path("whatsapp", WhatsAppLogListCreate.as_view(), name="whatsapp"),
]

