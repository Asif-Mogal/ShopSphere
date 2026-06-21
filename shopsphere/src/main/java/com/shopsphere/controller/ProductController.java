package com.shopsphere.controller;

import com.shopsphere.dto.ProductRequest;
import com.shopsphere.dto.ProductResponse;
import com.shopsphere.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(
            ProductService productService) {

        this.productService = productService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Create a product"
)
@PostMapping
    public ProductResponse createProduct(
            @Valid
            @RequestBody ProductRequest request) {

        return productService.createProduct(
                request);
    }

    @Operation(
        summary = "Get all products"
)
@GetMapping
    public List<ProductResponse> getAllProducts() {

        return productService.getAllProducts();
    }

    @Operation(
        summary = "Get product by ID"
)
@GetMapping("/{id}")
    public ProductResponse getProductById(
            @PathVariable Long id) {

        return productService.getProductById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Update a product"
)
@PutMapping("/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @Valid
            @RequestBody ProductRequest request) {

        return productService.updateProduct(
                id,
                request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Delete a product"
)
@DeleteMapping("/{id}")
    public String deleteProduct(
            @PathVariable Long id) {

        productService.deleteProduct(id);

        return "Product deleted";
    }
}