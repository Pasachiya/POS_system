package com.pahana.edu.billing.service.interfaces;

import com.pahana.edu.billing.domain.dto.auth.AuthResponse;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.*;

class AuthServiceTest {

    @Test
    void isInterface() {
        assertTrue(AuthService.class.isInterface(), "AuthService should be an interface");
    }

    @Test
    void loginMethodSignature_IsCorrect() throws NoSuchMethodException {
        Method m = AuthService.class.getMethod("login", String.class, String.class);
        assertEquals(AuthResponse.class, m.getReturnType(), "login should return AuthResponse");
    }
}