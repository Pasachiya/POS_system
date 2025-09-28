// service/interfaces/AuthService.java
package com.pahana.edu.billing.service.interfaces;
import com.pahana.edu.billing.domain.dto.auth.AuthResponse;
public interface AuthService {
  AuthResponse login(String username, String rawPassword);
}
