package com.messageledger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SendEmailRequest {

    @NotBlank(message = "Email is required")
    @Pattern(regexp = ".+@.+\\..+", message = "Please enter a valid email (e.g. user@example.com)")
    private String emailTo;

    private String messageSent;

    public String getEmailTo() {
        return emailTo;
    }

    public void setEmailTo(String emailTo) {
        this.emailTo = emailTo;
    }

    public String getMessageSent() {
        return messageSent;
    }

    public void setMessageSent(String messageSent) {
        this.messageSent = messageSent;
    }
}
