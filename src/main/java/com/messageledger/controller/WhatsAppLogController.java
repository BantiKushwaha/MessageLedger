package com.messageledger.controller;

import com.messageledger.dto.SendWhatsAppRequest;
import com.messageledger.entity.WhatsAppLog;
import com.messageledger.repository.WhatsAppLogRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/whatsapp")
public class WhatsAppLogController {

    private final WhatsAppLogRepository whatsAppLogRepository;

    public WhatsAppLogController(WhatsAppLogRepository whatsAppLogRepository) {
        this.whatsAppLogRepository = whatsAppLogRepository;
    }

    @PostMapping
    public ResponseEntity<WhatsAppLogResponse> sendWhatsApp(@Valid @RequestBody SendWhatsAppRequest request) {
        WhatsAppLog log = new WhatsAppLog();
        log.setMobileNumber(request.getMobileNumber());
        log.setMessageSent(request.getMessageSent());
        log.setSentAt(Instant.now());
        log = whatsAppLogRepository.save(log);
        return ResponseEntity.ok(toResponse(log));
    }

    @GetMapping
    public ResponseEntity<List<WhatsAppLogResponse>> list() {
        List<WhatsAppLog> logs = whatsAppLogRepository.findAllOrderBySentAtDesc();
        List<WhatsAppLogResponse> responses = logs.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    private WhatsAppLogResponse toResponse(WhatsAppLog log) {
        WhatsAppLogResponse r = new WhatsAppLogResponse();
        r.setSerialNumber(log.getId());
        r.setMobileNumber(log.getMobileNumber());
        r.setMessageSent(log.getMessageSent());
        r.setSentAt(log.getSentAt().toString());
        return r;
    }

    public static class WhatsAppLogResponse {
        private Long serialNumber;
        private String mobileNumber;
        private String messageSent;
        private String sentAt;

        public Long getSerialNumber() { return serialNumber; }
        public void setSerialNumber(Long serialNumber) { this.serialNumber = serialNumber; }
        public String getMobileNumber() { return mobileNumber; }
        public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
        public String getMessageSent() { return messageSent; }
        public void setMessageSent(String messageSent) { this.messageSent = messageSent; }
        public String getSentAt() { return sentAt; }
        public void setSentAt(String sentAt) { this.sentAt = sentAt; }
    }
}
