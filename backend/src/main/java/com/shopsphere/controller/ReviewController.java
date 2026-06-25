package com.shopsphere.controller;

import com.shopsphere.dto.ReviewRequest;
import com.shopsphere.dto.ReviewResponse;
import com.shopsphere.entity.User;
import com.shopsphere.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @Operation(summary = "Add a product review")
    public ReviewResponse addReview(
            Authentication authentication,
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request) {
        User user = (User) authentication.getPrincipal();
        return reviewService.addReview(user.getEmail(), productId, request);
    }

    @GetMapping
    @Operation(summary = "Get reviews for a product")
    public List<ReviewResponse> getReviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }
}
