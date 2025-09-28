// api/AuthController.java
package com.pahana.edu.billing.api;

import com.pahana.edu.billing.domain.dto.auth.*;
import com.pahana.edu.billing.service.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest req){
    return ResponseEntity.ok(authService.login(req.username(), req.password()));
  }
}
