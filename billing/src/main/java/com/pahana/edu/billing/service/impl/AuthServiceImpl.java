// service/impl/AuthServiceImpl.java
package com.pahana.edu.billing.service.impl;

import com.pahana.edu.billing.domain.dto.auth.AuthResponse;
import com.pahana.edu.billing.repository.UserRepository;
import com.pahana.edu.billing.service.interfaces.AuthService;
import com.pahana.edu.billing.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
  private final UserRepository userRepo;
  private final PasswordEncoder encoder;
  private final JwtService jwtService; // ← inject JWT service

  @Override
  public AuthResponse login(String username, String rawPassword) {
    var user = userRepo.findByUsername(username)
        .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

    if (!encoder.matches(rawPassword, user.getPassword())) {
      throw new BadCredentialsException("Invalid credentials");
    }

    // Generate JWT with username and role
    String token = jwtService.generateToken(user.getUsername(), user.getUserType().name());

    // Return immutable DTO (record or all-args constructor)
    return new AuthResponse(token, user.getUsername(), user.getUserType().name());
  }
}
