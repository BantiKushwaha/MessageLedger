from django.db import models


class EmailLog(models.Model):
    email_to = models.CharField(max_length=254)
    message_sent = models.CharField(max_length=2000, blank=True, default="")
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "email_log"
        ordering = ["-sent_at"]


class SmsLog(models.Model):
    mobile_number = models.CharField(max_length=32)
    message_sent = models.CharField(max_length=2000)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "sms_log"
        ordering = ["-sent_at"]


class WhatsAppLog(models.Model):
    mobile_number = models.CharField(max_length=32)
    message_sent = models.CharField(max_length=2000)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "whatsapp_log"
        ordering = ["-sent_at"]
