create table if not exists patients (
    patient_id uuid primary key,
    name varchar(255),
    email varchar(255),
    weight_kg double precision,
    height_cm double precision,
    blood_type varchar(255),
    known_allergies text
);

create table if not exists doctor_records (
    id bigserial primary key,
    patient_id uuid not null,
    raw_transcription text,
    simplified_text text,
    raw_audio_url text
);

alter table doctor_records
    add column if not exists created_at timestamp not null default current_timestamp;

create index if not exists idx_doctor_records_patient_id on doctor_records (patient_id);

create table if not exists medical_records (
    id uuid primary key,
    patient_id uuid not null,
    file_name varchar(255),
    file_path text,
    uploaded_at timestamp
);

create index if not exists idx_medical_records_patient_id on medical_records (patient_id);