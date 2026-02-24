from __future__ import annotations

from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EmailLog, SmsLog, WhatsAppLog
from .serializers import EmailLogSerializer, SmsLogSerializer, WhatsAppLogSerializer


class EmailLogListCreate(APIView):
    def get(self, request):
        qs = EmailLog.objects.all().order_by("-sent_at")
        return Response(EmailLogSerializer(qs, many=True).data)

    def post(self, request):
        s = EmailLogSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        obj = EmailLog.objects.create(**s.validated_data)
        return Response(EmailLogSerializer(obj).data)


class SmsLogListCreate(APIView):
    def get(self, request):
        qs = SmsLog.objects.all().order_by("-sent_at")
        return Response(SmsLogSerializer(qs, many=True).data)

    def post(self, request):
        s = SmsLogSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        obj = SmsLog.objects.create(**s.validated_data)
        return Response(SmsLogSerializer(obj).data)


class WhatsAppLogListCreate(APIView):
    def get(self, request):
        qs = WhatsAppLog.objects.all().order_by("-sent_at")
        return Response(WhatsAppLogSerializer(qs, many=True).data)

    def post(self, request):
        s = WhatsAppLogSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        obj = WhatsAppLog.objects.create(**s.validated_data)
        return Response(WhatsAppLogSerializer(obj).data)
