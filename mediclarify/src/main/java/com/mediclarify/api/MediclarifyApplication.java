package com.mediclarify.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This single annotation is the magic button. 
// It tells Java: "Scan all the folders below me, find the Waiters (@RestController), 
// find the Chefs (@Service), and turn them all on!"
@SpringBootApplication
public class MediclarifyApplication {

    // The standard starting point for every Java program in the world
    public static void main(String[] args) {
        
        // This line ignites the Spring Boot engine
        SpringApplication.run(MediclarifyApplication.class, args);
        
    }
}
