package com.shopsphere.controller;

import com.shopsphere.dto.OrderResponse;
import com.shopsphere.dto.CheckoutRequest;
import com.shopsphere.entity.Order;
import com.shopsphere.entity.User;
import com.shopsphere.service.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(
            OrderService orderService) {

        this.orderService = orderService;
    }

    @Operation(
            summary = "Place an order"
    )
    @PostMapping("/place")
    public Order placeOrder(
            Authentication authentication,
            @Valid @RequestBody CheckoutRequest request) {

        User user =
                (User) authentication.getPrincipal();

        return orderService.placeOrder(
                user.getEmail(),
                request);
    }

    @Operation(
            summary = "Get all orders of current user"
    )
    @GetMapping
    public List<OrderResponse> getOrders(
            Authentication authentication) {

        User user =
                (User) authentication.getPrincipal();

        return orderService.getOrders(
                user.getEmail());
    }

    @Operation(
            summary = "Get order details"
    )
    @GetMapping("/{id}")
    public OrderResponse getOrderById(
            Authentication authentication,
            @PathVariable Long id) {

        User user =
                (User) authentication.getPrincipal();

        return orderService.getOrderById(
                user.getEmail(),
                id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Get all orders (Admin)"
    )
    @GetMapping("/all")
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Update order status (Admin)"
    )
    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return orderService.updateOrderStatus(id, status);
    }
}