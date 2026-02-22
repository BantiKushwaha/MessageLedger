package com.messageledger.controller;

import com.messageledger.dto.SendEmailRequest;
import com.messageledger.entity.EmailLog;
import com.messageledger.repository.EmailLogRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/emails")
public class EmailLogController {

    private final EmailLogRepository emailLogRepository;

    public EmailLogController(EmailLogRepository emailLogRepository) {
        this.emailLogRepository = emailLogRepository;
    }

    @PostMapping
    public ResponseEntity<EmailLogResponse> sendEmail(@Valid @RequestBody SendEmailRequest request) {
        EmailLog log = new EmailLog();
        log.setEmailTo(request.getEmailTo());
        log.setMessageSent(request.getMessageSent() != null ? request.getMessageSent() : "");
        log.setSentAt(Instant.now());
        log = emailLogRepository.save(log);
        return ResponseEntity.ok(toResponse(log));
    }

    @GetMapping
    public ResponseEntity<List<EmailLogResponse>> list() {
        List<EmailLog> logs = emailLogRepository.findAllOrderBySentAtDesc();
        List<EmailLogResponse> responses = logs.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    private EmailLogResponse toResponse(EmailLog log) {
        EmailLogResponse r = new EmailLogResponse();
        r.setSerialNumber(log.getId());
        r.setEmailTo(log.getEmailTo());
        r.setMessageSent(log.getMessageSent() != null ? log.getMessageSent() : "");
        r.setSentAt(log.getSentAt().toString());
        return r;
    }

    public static class EmailLogResponse {
        private Long serialNumber;
        private String emailTo;
        private String messageSent;
        private String sentAt;

        public Long getSerialNumber() { return serialNumber; }
        public void setSerialNumber(Long serialNumber) { this.serialNumber = serialNumber; }
        public String getEmailTo() { return emailTo; }
        public void setEmailTo(String emailTo) { this.emailTo = emailTo; }
        public String getMessageSent() { return messageSent; }
        public void setMessageSent(String messageSent) { this.messageSent = messageSent; }
        public String getSentAt() { return sentAt; }
        public void setSentAt(String sentAt) { this.sentAt = sentAt; }
    }
}
