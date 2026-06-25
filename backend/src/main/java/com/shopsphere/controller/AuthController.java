package com.shopsphere.controller;

import com.shopsphere.dto.RegisterRequest;
import com.shopsphere.entity.User;
import com.shopsphere.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.shopsphere.dto.LoginRequest;
import jakarta.validation.Valid;
import com.shopsphere.dto.UserResponse;
import org.springframework.security.core.Authentication;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @Operation(
        summary = "Register a new user"
    )
    @PostMapping("/register")
    public User register(
            @Valid
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @Operation(
        summary = "Login and receive JWT token"
)
@PostMapping("/login")
    public String login(
        @Valid
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @Operation(
        summary = "Get current user profile"
)
@GetMapping("/me")
public UserResponse me(
        Authentication authentication) {

    User user =
            (User) authentication.getPrincipal();

    return authService.getCurrentUser(
            user.getEmail());
}
}