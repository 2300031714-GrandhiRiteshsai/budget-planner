package com.budgetplannerbackend.controller;

import com.budgetplannerbackend.model.User;
import com.budgetplannerbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // Check if username/email already exists
        if(userRepository.findByUsername(user.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Save user to DB (password in plain text)
        User savedUser = userRepository.save(user);

        // Remove password from response
        savedUser.setPassword(null);

        return ResponseEntity.ok(new AuthResponse("dummy-token", savedUser));
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        Optional<User> existing = userRepository.findByUsername(user.getUsername());

        if(existing.isPresent() && existing.get().getPassword().equals(user.getPassword())) {
            User safeUser = existing.get();
            safeUser.setPassword(null); // remove password from response
            return ResponseEntity.ok(new AuthResponse("dummy-token", safeUser));
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // ---------------- RESPONSE DTO ----------------
    static class AuthResponse {
        public String token;
        public User user;

        public AuthResponse(String token, User user){
            this.token = token;
            this.user = user;
        }
    }
}
