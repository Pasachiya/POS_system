// config/JwtAuthFilter.java
package com.pahana.edu.billing.config;

import com.pahana.edu.billing.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Slf4j
// @Component 
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final UserRepository userRepo;

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    boolean shouldSkip = path.equals("/api/health") || 
           path.startsWith("/api/auth/") || 
           path.startsWith("/api/bills") ||  // Remove the trailing slash
           path.equals("/error");
    
    log.info("🔍 JWT Filter - Path: {}, Should Skip: {}", path, shouldSkip);
    return shouldSkip;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    
    String path = req.getRequestURI();
    String header = req.getHeader("Authorization");
    
    log.info("🔐 JWT Filter Processing - Path: {}, Has Auth Header: {}", path, header != null);
    
    if(StringUtils.hasText(header) && header.startsWith("Bearer ")){
      String token = header.substring(7);
      try {
        String username = jwtService.extractUsername(token);
        log.info("📝 Extracted username from token: {}", username);
        
        var user = userRepo.findByUsername(username).orElse(null);
        if(user != null){
          log.info("✅ User found: {}, Role: {}", username, user.getUserType());
          var auth = new UsernamePasswordAuthenticationToken(
              username, null, List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserType().name())));
          SecurityContextHolder.getContext().setAuthentication(auth);
          log.info("🔑 Authentication set successfully for user: {}", username);
        } else {
          log.warn("❌ User not found in database: {}", username);
        }
      } catch(Exception e) {
        log.error("💥 JWT processing failed: {}", e.getMessage());
      }
    } else {
      log.warn("🚫 No valid Authorization header found");
    }
    
    chain.doFilter(req, res);
  }
}
