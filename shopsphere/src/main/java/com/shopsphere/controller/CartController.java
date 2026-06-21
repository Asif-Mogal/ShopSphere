package com.shopsphere.controller;

import com.shopsphere.dto.CartRequest;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.User;
import com.shopsphere.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(
            CartService cartService) {

        this.cartService = cartService;
    }

    @Operation(
            summary = "Add product to cart"
    )
    @PostMapping("/add")
    public CartItem addToCart(
            Authentication authentication,
            @Valid
            @RequestBody CartRequest request) {

        User user =
                (User) authentication.getPrincipal();

        return cartService.addToCart(
                user.getEmail(),
                request);
    }

    @Operation(
            summary = "Increase quantity"
    )
    @PutMapping("/{id}/increase")
    public CartItem increaseQuantity(
            @PathVariable Long id) {

        return cartService.increaseQuantity(
                id);
    }

    @Operation(
            summary = "Decrease quantity"
    )
    @PutMapping("/{id}/decrease")
    public CartItem decreaseQuantity(
            @PathVariable Long id) {

        return cartService.decreaseQuantity(
                id);
    }

    @Operation(
            summary = "Get current user's cart"
    )
    @GetMapping
    public List<CartItem> getCart(
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        return cartService.getCart(
                user.getEmail());
    }

    @Operation(
            summary = "Remove item from cart"
    )
    @DeleteMapping("/{id}")
    public String removeFromCart(
            @PathVariable Long id) {

        cartService.removeFromCart(id);

        return "Item removed";
    }
}