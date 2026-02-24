from __future__ import annotations

from rest_framework import serializers

from .models import EmailLog, SmsLog, WhatsAppLog


class EmailLogSerializer(serializers.ModelSerializer):
    serialNumber = serializers.IntegerField(source="id", read_only=True)
    emailTo = serializers.CharField(
        source="email_to",
        allow_blank=False,
        error_messages={
            "blank": "Email is required",
            "required": "Email is required",
        },
    )
    messageSent = serializers.CharField(
        source="message_sent",
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=2000,
    )
    sentAt = serializers.DateTimeField(source="sent_at", read_only=True)

    class Meta:
        model = EmailLog
        fields = ["serialNumber", "emailTo", "messageSent", "sentAt"]

    def validate_emailTo(self, value: str) -> str:
        value = (value or "").strip()
        # Match Spring regex: ".+@.+\\..+"
        if "@" not in value or "." not in value.split("@")[-1]:
            raise serializers.ValidationError("Please enter a valid email (e.g. user@example.com)")
        return value

    def validate(self, attrs):
        msg = attrs.get("message_sent", "")
        if msg is None:
            attrs["message_sent"] = ""
        return attrs


class SmsLogSerializer(serializers.ModelSerializer):
    serialNumber = serializers.IntegerField(source="id", read_only=True)
    mobileNumber = serializers.RegexField(
        source="mobile_number",
        regex=r"^\+?[0-9]{10}$",
        error_messages={
            "blank": "Mobile number is required",
            "required": "Mobile number is required",
            "invalid": "Mobile number must be exactly 10 digits",
        },
    )
    messageSent = serializers.CharField(
        source="message_sent",
        allow_blank=False,
        error_messages={
            "blank": "Message is required",
            "required": "Message is required",
        },
        max_length=2000,
    )
    sentAt = serializers.DateTimeField(source="sent_at", read_only=True)

    class Meta:
        model = SmsLog
        fields = ["serialNumber", "mobileNumber", "messageSent", "sentAt"]


class WhatsAppLogSerializer(serializers.ModelSerializer):
    serialNumber = serializers.IntegerField(source="id", read_only=True)
    mobileNumber = serializers.RegexField(
        source="mobile_number",
        regex=r"^\+?[0-9]{10}$",
        error_messages={
            "blank": "Mobile number is required",
            "required": "Mobile number is required",
            "invalid": "Mobile number must be exactly 10 digits",
        },
    )
    messageSent = serializers.CharField(
        source="message_sent",
        allow_blank=False,
        error_messages={
            "blank": "Message is required",
            "required": "Message is required",
        },
        max_length=2000,
    )
    sentAt = serializers.DateTimeField(source="sent_at", read_only=True)

    class Meta:
        model = WhatsAppLog
        fields = ["serialNumber", "mobileNumber", "messageSent", "sentAt"]

