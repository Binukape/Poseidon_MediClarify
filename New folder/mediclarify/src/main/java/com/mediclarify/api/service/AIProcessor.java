package com.mediclarify.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Base64;
import java.util.List;

@Service
public class AIProcessor {

    @Value("${ai.gemini.url}")
    private String geminiUrl;

    @Value("${ai.gemini.api-key}")
    private String geminiApiKey;

    public String transcribeAudio(byte[] audioBytes) {
        RestTemplate restTemplate = new RestTemplate();
        String endpoint = geminiUrl + geminiApiKey;

        String base64Audio = Base64.getEncoder().encodeToString(audioBytes);

        String requestBody = "{" +
                "\"contents\": [{" +
                "\"parts\": [" +
                "{\"text\": \"Please transcribe this medical audio recording accurately word-for-word.\" }," +
                "{\"inline_data\": {\"mime_type\": \"audio/webm\", \"data\": \"" + base64Audio + "\"}}" +
                "]" +
                "}]" +
                "}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Transcription failed.";
        }
    }

    public String simplifySingleTranscription(String rawTranscription) {
        if (rawTranscription == null || rawTranscription.isEmpty())
            return "No text to simplify.";

        RestTemplate restTemplate = new RestTemplate();
        String endpoint = geminiUrl + geminiApiKey;

        String prompt = "You are a medical communication assistant for MediClarify. " +
                "Your job is to take a transcript of a doctor-patient consultation and produce TWO things. " +
                "1. Simplified Summary: Rewrite the medical content in plain, patient-friendly language. " +
                "2. Key Instructions: Extract actionable items (medications, dosage, follow-ups). Format as a bulleted list. "
                +
                "Respond in this EXACT format:\n" +
                "### Patient-Friendly Summary\n" +
                "[your simplified summary]\n\n" +
                "### Key Instructions\n" +
                "- [instruction 1]\n" +
                "- [instruction 2]\n\n" +
                "Transcript: " + rawTranscription;
        String safePrompt = prompt.replace("\n", "\\n").replace("\"", "\\\"");
        String requestBody = "{ \"contents\": [ { \"parts\": [ { \"text\": \"" + safePrompt + "\" } ] } ] }";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Simplification failed.";
        }
    }

    public String generateSimplifiedReport(List<String> pastNotes) {
        if (pastNotes.isEmpty())
            return "No medical history found to summarize.";

        RestTemplate restTemplate = new RestTemplate();
        String endpoint = geminiUrl + geminiApiKey;

        String combinedNotes = String.join("\n\n---\n\n", pastNotes);

        String prompt = "Act as a friendly doctor. Here are the patient's past consultation notes:\n" +
                combinedNotes +
                "\n\nPlease write a short, simple, 3-sentence medical summary in plain English based ONLY on these notes.";

        String safePrompt = prompt.replace("\n", "\\n").replace("\"", "\\\"");
        String requestBody = "{ \"contents\": [ { \"parts\": [ { \"text\": \"" + safePrompt + "\" } ] } ] }";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            String cleanText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text")
                    .asText();
            return "MediClarify Official Summary:\n\n" + cleanText;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error parsing AI response.";
        }
    }
}