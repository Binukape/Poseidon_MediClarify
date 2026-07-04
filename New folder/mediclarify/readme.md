# MediClarify Backend API - Team Poseidon 🌊

Welcome to the backend repository for **MediClarify**, a patient-centric medical application designed to reduce anxiety and bridge the communication gap between doctors and patients using AI-driven simplification.

This backend is built using **Java Spring Boot**, **PostgreSQL (via Supabase)**, and the **Google Gemini 2.5 Flash AI Model**.

---

## 🏗️ Part 1: Architecture & OOAD Alignment

This codebase is a direct implementation of the **Team Poseidon Object-Oriented Analysis and Design (OOAD)** document. It utilizes a strict 3-Tier Architecture (Presentation, Application, Data) and heavily employs Encapsulation and Abstraction to protect patient data and handle complex background tasks.

### Object Mapping (UML to Code)
Our system logic is driven by the interaction of six crucial object-oriented components defined in Section 1.2 of our design document:

| UML Object | Java Implementation | Responsibility |
| :--- | :--- | :--- |
| **Patient** | `Patient.java` / `PatientRepository.java` | Manages the user profile, UUID, and initiates workflows (Phase 1). |
| **DoctorRecord** | `DoctorRecordController.java` | Encapsulates a specific visit's raw audio and final simplified text (Phase 2). |
| **MedicalRecord** | `MedicalRecordController.java` | Maintains the patient's overarching history and securely houses uploaded documents (Phase 3). |
| **AIProcessor** | `AIProcessor.java` | Provides **Abstraction** by handling complex cognitive tasks (Speech-to-Text & Simplification) behind a clean interface. |
| **ReportGenerator**| `ReportGeneratorController.java`| Compiles historical data and AI simplifications into a structured, downloadable `.txt` report (Phase 4). |
| **Prescription** | *Dynamically Extracted* | Medication usage is isolated and organized within the "Key Instructions" section of the AI Summary Report. |

### State Machine & Control Flow Compliance
The Java Controllers strictly enforce the dynamic control flows outlined in our Activity Diagrams:
*   **Phase 2 (Consultation):** Enforces the strict sequential state machine: `RawAudioSaved` -> `Transcribing` -> `Simplifying` -> `Completed`.
*   **Phase 3 (Vault):** Enforces strict file validation (only allowing `< 5MB` and `application/pdf` or `image/*`) before allowing the state to transition to `StoredSecurely`.

---

## 🔌 Part 2: Frontend Integration Guide (API Contract)

This section is for the Frontend Developer. It defines the exact endpoints, HTTP methods, and data formats required to connect the UI to this backend.

**Base URL:** `http://localhost:8080` (or the live hosted URL)
**CORS:** Enabled for `*` (All origins).

### 1. Patient Registration (Post-Login)
Registers a new patient in the PostgreSQL database after a successful Supabase Auth login.

*   **Endpoint:** `POST /api/patients/register`
*   **Content-Type:** `application/json`
*   **Body:**
    ```json
    {
      "patientId": "uuid-string-from-supabase",
      "name": "John Doe",
      "email": "john@example.com"
    }
    ```

### 2. Audio Consultation Upload (DoctorRecord)
Uploads the raw `.webm` or `.mp3` audio, transcribes it, and returns the AI-simplified medical explanation.

*   **Endpoint:** `POST /api/doctor-records/upload`
*   **Content-Type:** `multipart/form-data` *(Note: Let the browser set this automatically! Do not set it manually in `fetch` or `axios`).*
*   **FormData Keys:**
    *   `audioFile` (Blob/File): The recorded audio.
    *   `patientId` (String): The UUID of the user.
*   **Response:** `200 OK` (Returns plain text: The simplified AI summary).

### 3. Medical Document Upload (MedicalRecord)
Uploads historical medical documents (Lab results, old prescriptions) to the secure vault.

*   **Endpoint:** `POST /api/medical-records/upload`
*   **Content-Type:** `multipart/form-data` *(Note: Let the browser set this automatically).*
*   **FormData Keys:**
    *   `file` (File): The PDF, JPG, or PNG document.
    *   `patientId` (String): The UUID of the user.
*   **Response:** `200 OK` (Returns plain text: The Supabase storage file path).

### 4. Report Generation
Compiles a master summary report of the patient's recent consultations.

*   **Endpoint:** `GET /api/reports-generator/generate/{patientId}`
*   **Path Variable:** `patientId` (The UUID of the user).
*   **Response:** `200 OK` (Returns plain text: A formatted Markdown string containing consultation details, bulleted key instructions, and raw transcripts).

---

## 🛠️ Local Setup Instructions

To run this backend locally:

1. Clone the repository.
2. Ensure you have Java 17+ installed.
3. Add a `.env` file to the root or set the following Environment Variables in your IDE:
    * `DB_URL` (Must start with `jdbc:postgresql://`)
    * `DB_USER`
    * `DB_PASSWORD`
    * `SUPABASE_URL`
    * `SUPABASE_KEY` (Service Role Key)
    * `GEMINI_API_KEY`
4. Run `mvn spring-boot:run` or execute `MediclarifyApplication.java` in your IDE.