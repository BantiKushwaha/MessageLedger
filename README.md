# Message Ledger

A full-stack web application for logging and viewing **Email**, **SMS**, and **WhatsApp** messages. Entries are stored in a database and displayed in tabbed list views—no actual messages are sent to external services.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)

---

## Tech Stack

| Layer      | Technologies                          |
| ---------- | ------------------------------------- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript       |
| **Backend**  | Java 17, Maven, Spring Boot, Spring Data JPA |
| **Database** | PostgreSQL                            |

---

## Features

- **Multi-channel Compose** — Single compose area at the top with channel selector (Email / SMS / WhatsApp) and a dynamic form that adapts to the selected channel.
- **Email** — Compose with “Email To” and “Message”; entries listed with Serial No., Email Sent To, Message, and Timestamp.
- **SMS & WhatsApp** — Compose with “Mobile Number (10 digits)” and “Message”; **mobile number validation** (exactly 10 digits) on both frontend and backend.
- **Tabbed list views** — Emails Sent, SMS Sent, and WhatsApp Sent, each with its own columns and data.
- **Export** — Export each list as **CSV** or **JSON** from the toolbar above the table.

---

## Prerequisites

- **JDK 17** or higher  
- **Maven 3.6+**  
- **PostgreSQL** (server running; you will create or use an existing database)

---

## Getting Started

### 1. Clone or download the project

```bash
git clone https://github.com/YOUR_USERNAME/MessageLedger.git
cd MessageLedger
```

### 2. Create a database (if needed)

Using the PostgreSQL client (e.g. `psql`):

```sql
CREATE DATABASE postgres;
```

Or use an existing database and set its name in configuration (see [Configuration](#configuration)).

### 3. Build the application

```bash
mvn clean install
```

### 4. Run the application

```bash
mvn spring-boot:run
```

### 5. Open in browser

Navigate to:

**http://localhost:8090**

---

## Configuration

Edit `src/main/resources/application.properties` to match your environment:

| Property | Description | Example |
| -------- | ----------- | ------- |
| `server.port` | HTTP port | `8090` |
| `spring.datasource.url` | JDBC URL | `jdbc:postgresql://localhost:5432/postgres` |
| `spring.datasource.username` | DB username | `postgres` |
| `spring.datasource.password` | DB password | `your_password` |

Example:

```properties
server.port=8090

spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
```

---

## Project Structure

```
MessageLedger/
├── pom.xml
├── README.md
├── src/main/java/com/messageledger/
│   ├── MessageLedgerApplication.java
│   ├── config/
│   │   └── GlobalExceptionHandler.java
│   ├── controller/
│   │   ├── EmailLogController.java
│   │   ├── SmsLogController.java
│   │   └── WhatsAppLogController.java
│   ├── dto/
│   │   ├── SendEmailRequest.java
│   │   ├── SendSmsRequest.java
│   │   └── SendWhatsAppRequest.java
│   ├── entity/
│   │   ├── EmailLog.java
│   │   ├── SmsLog.java
│   │   └── WhatsAppLog.java
│   └── repository/
│       ├── EmailLogRepository.java
│       ├── SmsLogRepository.java
│       └── WhatsAppLogRepository.java
└── src/main/resources/
    ├── application.properties
    └── static/
        ├── index.html
        ├── css/
        │   └── style.css
        └── js/
            └── app.js
```

---

## API Reference

All endpoints return JSON. Request bodies must use `Content-Type: application/json`.

### Emails

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/api/emails` | List all email logs (newest first). |
| `POST` | `/api/emails` | Create an email log entry. |

**POST /api/emails** — Request body:

```json
{
  "emailTo": "user@example.com",
  "messageSent": "Optional message body"
}
```

### SMS

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/api/sms` | List all SMS logs (newest first). |
| `POST` | `/api/sms` | Create an SMS log entry. |

**POST /api/sms** — Request body (`mobileNumber` must be exactly 10 digits):

```json
{
  "mobileNumber": "1234567890",
  "messageSent": "Your message text"
}
```

### WhatsApp

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/api/whatsapp` | List all WhatsApp logs (newest first). |
| `POST` | `/api/whatsapp` | Create a WhatsApp log entry. |

**POST /api/whatsapp** — Request body (same as SMS; `mobileNumber` must be exactly 10 digits):

```json
{
  "mobileNumber": "1234567890",
  "messageSent": "Your message text"
}
```

