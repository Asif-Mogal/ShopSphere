package com.shopsphere.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private Double price;

    private Integer stock;

    private String category;

    private String imageUrl;
}
