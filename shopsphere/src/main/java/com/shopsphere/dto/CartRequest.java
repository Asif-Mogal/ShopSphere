package com.shopsphere.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartRequest {

    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be positive")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be at least 1")
    private Integer quantity;
}