# Message Ledger

A full-stack web application for logging and viewing **Email**, **SMS**, and **WhatsApp** messages.

- The **backend** is a Django + Django REST Framework (DRF) API.
- The **frontend** is plain HTML/CSS/JavaScript served by the backend at `/`.
- Entries are stored in a database and displayed in tabbed list views—no actual messages are sent to external services.

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

| Layer      | Technologies |
| ---------- | ------------ |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend**  | Python, Django, Django REST Framework |
| **Database** | SQLite (default) / PostgreSQL (optional via `DATABASE_URL`) |

---

## Features

- **Multi-channel Compose** — Single compose area at the top with channel selector (Email / SMS / WhatsApp) and a dynamic form that adapts to the selected channel.
- **Email** — Compose with “Email To” and “Message”; entries listed with Serial No., Email Sent To, Message, and Timestamp.
- **SMS & WhatsApp** — Compose with “Mobile Number (10 digits)” and “Message”; **mobile number validation** (exactly 10 digits) on both frontend and backend.
- **Tabbed list views** — Emails Sent, SMS Sent, and WhatsApp Sent, each with its own columns and data.
- **Export** — Export each list as **CSV** or **JSON** from the toolbar above the table.

---

## Prerequisites

- **Python 3.10+** (recommended)
- Optional: **PostgreSQL** (only if you choose to use `DATABASE_URL`)

---

## Getting Started

### 1. Clone the project

```bash
git clone https://github.com/BantiKushwaha/MessageLedger.git
```

### 2. Setup backend

From the `Backend/` folder:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the server:

```bash
python manage.py runserver
```

### 3. Open in browser

- Frontend: `http://127.0.0.1:8000/`
- Admin: `http://127.0.0.1:8000/admin/`
- API base: `http://127.0.0.1:8000/api/`

---

## Configuration

Backend reads environment variables from `Backend/.env`.

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `DJANGO_DEBUG` | Debug mode (enables permissive CORS) | `1` |
| `DJANGO_SECRET_KEY` | Django secret key | `change-me` |
| `DATABASE_URL` | Optional DB connection string (if omitted, SQLite is used) | `postgres://postgres:1234@localhost:5432/postgres` |

Notes:

- If you **do not** set `DATABASE_URL`, the backend uses `Backend/db.sqlite3`.
- The frontend JS uses `API_BASE = ''`, so it calls `/api/...` on the **same host** the backend is running on.

---

## Project Structure

```
MessageLedger/
├── README.md
├── Backend/
│   ├── .env.example
│   ├── db.sqlite3
│   ├── manage.py
│   ├── requirements.txt
│   ├── api/
│   │   ├── urls.py
│   │   ├── serializers.py
│   │   └── views.py
│   ├── frontend_app/
│   │   ├── urls.py
│   │   └── views.py
│   └── messageledger_backend/
│       ├── settings.py
│       └── urls.py
└── Frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

---

## API Reference

All endpoints return JSON. Request bodies must use `Content-Type: application/json`.

Base URL: `/api`

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
