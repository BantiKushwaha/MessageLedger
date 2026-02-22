package com.messageledger.controller;

import com.messageledger.dto.SendSmsRequest;
import com.messageledger.entity.SmsLog;
import com.messageledger.repository.SmsLogRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sms")
public class SmsLogController {

    private final SmsLogRepository smsLogRepository;

    public SmsLogController(SmsLogRepository smsLogRepository) {
        this.smsLogRepository = smsLogRepository;
    }

    @PostMapping
    public ResponseEntity<SmsLogResponse> sendSms(@Valid @RequestBody SendSmsRequest request) {
        SmsLog log = new SmsLog();
        log.setMobileNumber(request.getMobileNumber());
        log.setMessageSent(request.getMessageSent());
        log.setSentAt(Instant.now());
        log = smsLogRepository.save(log);
        return ResponseEntity.ok(toResponse(log));
    }

    @GetMapping
    public ResponseEntity<List<SmsLogResponse>> list() {
        List<SmsLog> logs = smsLogRepository.findAllOrderBySentAtDesc();
        List<SmsLogResponse> responses = logs.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    private SmsLogResponse toResponse(SmsLog log) {
        SmsLogResponse r = new SmsLogResponse();
        r.setSerialNumber(log.getId());
        r.setMobileNumber(log.getMobileNumber());
        r.setMessageSent(log.getMessageSent());
        r.setSentAt(log.getSentAt().toString());
        return r;
    }

    public static class SmsLogResponse {
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
