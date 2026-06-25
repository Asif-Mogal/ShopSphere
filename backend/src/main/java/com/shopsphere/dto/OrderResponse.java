package com.shopsphere.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long id;

    private Double totalAmount;

    private String status;

    private LocalDateTime createdAt;

    private String shippingAddress;

    private String phoneNumber;

    private List<OrderItemResponse> items;
}
