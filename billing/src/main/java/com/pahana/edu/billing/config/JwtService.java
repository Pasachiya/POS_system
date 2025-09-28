// config/JwtService.java
package com.pahana.edu.billing.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtService {
  @Value("${app.security.jwt-secret}") private String secret;
  @Value("${app.security.jwt-expiration-ms}") private long expirationMs;

  private SecretKey key(){ return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }

  public String generateToken(String username, String role){
    return Jwts.builder()
      .setSubject(username)
      .claim("role", role)
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis()+expirationMs))
      .signWith(key()).compact();
  }

  public String extractUsername(String token){
    return Jwts.parserBuilder().setSigningKey(key()).build()
        .parseClaimsJws(token).getBody().getSubject();
  }
}
