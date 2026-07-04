package com.mediclarify.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SupabaseStorageService {
    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    public String uploadAudioFile(MultipartFile file, String patientId) throws Exception {
        String uniqueFileName = UUID.randomUUID().toString() + ".webm";
        String endpoint = supabaseUrl + "/storage/v1/object/medical-documents/" + patientId + "/" + uniqueFileName;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("apikey", supabaseKey); // CRITICAL for Supabase REST API
        headers.setContentType(file.getContentType() != null ? MediaType.valueOf(file.getContentType())
                : MediaType.APPLICATION_OCTET_STREAM);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return patientId + "/" + uniqueFileName;
        } else {
            throw new Exception(
                    "Storage rejected file. Status=" + response.getStatusCode() + ", body=" + response.getBody());
        }
    }

    public String getPublicUrl(String bucket, String path) {
        return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + path;
    }

    public String uploadDocumentFile(MultipartFile file, String patientId) throws Exception {
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String uniqueFileName = UUID.randomUUID().toString() + extension;
        String endpoint = supabaseUrl + "/storage/v1/object/medical-documents/" + patientId + "/" + uniqueFileName;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("apikey", supabaseKey); // CRITICAL for Supabase REST API
        headers.setContentType(file.getContentType() != null ? MediaType.valueOf(file.getContentType())
                : MediaType.APPLICATION_OCTET_STREAM);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return patientId + "/" + uniqueFileName;
        } else {
            throw new Exception("Storage rejected document file. Status=" + response.getStatusCode() + ", body="
                    + response.getBody());
        }
    }

    public List<String> listPatientDocuments(String patientId) throws Exception {
        String endpoint = supabaseUrl + "/storage/v1/object/list/medical-documents?prefix=" + patientId + "/";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.GET, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            List<String> documentPaths = new ArrayList<>();
            if (root.isArray()) {
                for (JsonNode node : root) {
                    if (node.has("name")) {
                        documentPaths.add(node.get("name").asText());
                    }
                }
            }
            return documentPaths;
        } else {
            throw new Exception("Unable to list documents.");
        }
    }
}