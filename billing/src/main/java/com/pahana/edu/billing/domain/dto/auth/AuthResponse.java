package com.pahana.edu.billing.domain.dto.auth;

// Simple immutable DTO for login response
public record AuthResponse(String token, String username, String role) {}