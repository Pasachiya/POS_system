package com.pahana.edu.billing.service.impl;

import com.pahana.edu.billing.config.JwtService;
import com.pahana.edu.billing.domain.dto.auth.AuthResponse;
import com.pahana.edu.billing.domain.entity.User;
import com.pahana.edu.billing.domain.enums.UserType;
import com.pahana.edu.billing.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepo;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private final String username = "testuser";
    private final String rawPassword = "password123";
    private final String encodedPassword = "encodedPassword123";
    private final String jwtToken = "jwt.token.here";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUsername(username);
        testUser.setPassword(encodedPassword);
        testUser.setUserType(UserType.ADMIN);
    }

    @Test
    void login_ValidCredentials_ReturnsAuthResponse() {
        // Arrange
        when(userRepo.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(encoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(jwtService.generateToken(username, UserType.ADMIN.name())).thenReturn(jwtToken);

        // Act
        AuthResponse result = authService.login(username, rawPassword);

        // Assert
        assertNotNull(result);
        assertEquals(jwtToken, result.token());
        verify(userRepo).findByUsername(username);
        verify(encoder).matches(rawPassword, encodedPassword);
        verify(jwtService).generateToken(username, UserType.ADMIN.name());
    }

    @Test
    void login_UserNotFound_ThrowsBadCredentialsException() {
        // Arrange
        when(userRepo.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        BadCredentialsException exception = assertThrows(
            BadCredentialsException.class,
            () -> authService.login(username, rawPassword)
        );
        assertEquals("Invalid credentials", exception.getMessage());
        verify(userRepo).findByUsername(username);
        verify(encoder, never()).matches(anyString(), anyString());
        verify(jwtService, never()).generateToken(anyString(), anyString());
    }

    @Test
    void login_InvalidPassword_ThrowsBadCredentialsException() {
        // Arrange
        when(userRepo.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(encoder.matches(rawPassword, encodedPassword)).thenReturn(false);

        // Act & Assert
        BadCredentialsException exception = assertThrows(
            BadCredentialsException.class,
            () -> authService.login(username, rawPassword)
        );
        assertEquals("Invalid credentials", exception.getMessage());
        verify(userRepo).findByUsername(username);
        verify(encoder).matches(rawPassword, encodedPassword);
        verify(jwtService, never()).generateToken(anyString(), anyString());
    }

    @Test
    void login_NullUsername_ThrowsBadCredentialsException() {
        // Arrange
        when(userRepo.findByUsername(null)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
            BadCredentialsException.class,
            () -> authService.login(null, rawPassword)
        );
        verify(userRepo).findByUsername(null);
    }

    @Test
    void login_EmptyUsername_ThrowsBadCredentialsException() {
        // Arrange
        when(userRepo.findByUsername("")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
            BadCredentialsException.class,
            () -> authService.login("", rawPassword)
        );
        verify(userRepo).findByUsername("");
    }
}