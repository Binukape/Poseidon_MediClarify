# MediClarify

**AI-Powered Medical Information Assistant** — by Team Poseidon

MediClarify is a full-stack healthcare application that records patient consultations, transcribes spoken dialogue, simplifies complex medical terminology into plain language, and manages structured medical records.

---

## 📖 Table of Contents

- [Problem & Solution](#-problem--solution)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Database Design](#-database-design)
- [AI Processing Pipeline](#-ai-processing-pipeline)
- [Contributors](#-contributors)

---

## 🩺 Problem & Solution

**Problem:**

- Medical explanations are difficult to understand for patients without clinical training.
- Patients frequently forget key details from consultations after leaving the clinic.
- Medical documents are scattered across different providers and formats.
- Previous records are difficult to access when needed for follow-up care.

**MediClarify provides:**

| Feature                       | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| 🎙️ Consultation Recording     | Capture audio during medical appointments           |
| 🔤 Speech Transcription       | Convert spoken dialogue to structured text          |
| 🧬 Explanation Simplification | AI rewrites complex medical terms in plain language |
| 📁 Record Management          | Centralised, persistent medical document storage    |
| 📋 Health Summary Generation  | Automated summaries of patient history and records  |

---

## ✨ Features

The system allows patients to:

- Manually start and stop the recording of their medical consultations
- View simplified summaries of their consultations
- Upload their own medical documents
- Access their own medical history
- Request and download a compiled medical summary report to share during future doctor visits

The system also highlights important instructions such as medication usage and follow-up steps.

---

## 🏗️ System Architecture

MediClarify follows a **layered, service-oriented architecture** that enforces separation of concerns. Each layer has a single responsibility, enabling modular development, independent testing, and clean abstraction boundaries:

**Frontend → REST Controllers → Service Layer → Repository Layer → PostgreSQL Database → Supabase Storage → Gemini API**

**Design principles:**

- **Separation of Concerns** — each layer handles one aspect of the system
- **Modular Design** — components can be developed and tested independently
- **Layered Architecture** — clear dependency flow from UI to data store

The backend also applies core object-oriented principles: encapsulation of patient and record data, abstraction through service and repository layers, and inheritance via shared repository interfaces.

---

## 🛠️ Tech Stack

| Layer                | Technology         |
| -------------------- | ------------------ |
| Frontend             | TypeScript / React |
| Backend              | Java (Spring Boot) |
| Database             | PostgreSQL         |
| File & Audio Storage | Supabase Storage   |
| AI Processing        | Google Gemini API  |
| Styling              | CSS                |

---

## 🗄️ Database Design

**Patient** — stores core patient profile information: name, email, weight, height, blood type, and allergies.

**DoctorRecord** _(1:N with Patient)_ — represents a single consultation session, storing the raw transcription, the simplified explanation, and the linked audio file.

**MedicalRecord** _(1:N with Patient)_ — stores uploaded medical documents along with their file metadata and upload time.

Data flows through four layers: a REST controller receives the HTTP request, the service layer applies business logic, the repository layer queries the database, and PostgreSQL returns the persisted data.

---

## 🤖 AI Processing Pipeline

Audio recordings are transformed into clear, patient-friendly medical explanations through a structured, multi-stage AI pipeline powered by Google's Gemini API — audio is encoded, sent to Gemini, transcribed, and then simplified into plain language. Each stage handles a distinct concern, ensuring clean separation of responsibilities.

This is handled by a dedicated AI processor service that sits between the controller and the Gemini API, exposing three core capabilities:

- **Transcription** — converts audio input to text
- **Simplification** — rewrites medical text in plain language
- **Report Generation** — produces a structured, readable summary of a patient's records

---

## 👥 Contributors

**Team Poseidon**

| Name                  | Student ID | GitHub Username                                                      |
| --------------------- | ---------- | -------------------------------------------------------------------- |
| K.D.B.M. Perera       | 240498V    | [`@Binukape`](https://github.com/Binukape)                           |
| R.G.A.D.B. Ranasinghe | 240548C    | [`@anuhasranasinghe`](https://github.com/anuhasranasinghe)           |
| H.P.S.B. Pilapitiya   | 240512L    | [`@SayuruPilapitiya`](https://github.com/SayuruPilapitiya)           |
| U.W.D.J. Ayesmantha   | 240052B    | [`@DeshanAyesh`](https://github.com/DeshanAyesh)                     |
| G.D.J.P. Gamaetige    | 240180N    | [`@pabodhagamaethige-jpg`](https://github.com/pabodhagamaethige-jpg) |
