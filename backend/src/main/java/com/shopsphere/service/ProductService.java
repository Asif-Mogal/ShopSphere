package com.shopsphere.service;

import com.shopsphere.dto.ProductRequest;
import com.shopsphere.dto.ProductResponse;
import com.shopsphere.entity.Product;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(
            ProductRepository productRepository) {

        this.productRepository = productRepository;
    }

    private ProductResponse mapToResponse(
            Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .build();
    }

    private Product getProductEntityById(
            Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"));
    }

    public ProductResponse createProduct(
            ProductRequest request) {

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .build();

        return mapToResponse(
                productRepository.save(product));
    }

    public List<ProductResponse> getAllProducts(String search, String category, String sortBy) {
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.unsorted();
        if (sortBy != null) {
            if (sortBy.equalsIgnoreCase("priceAsc")) {
                sort = org.springframework.data.domain.Sort.by("price").ascending();
            } else if (sortBy.equalsIgnoreCase("priceDesc")) {
                sort = org.springframework.data.domain.Sort.by("price").descending();
            }
        }

        String searchParam = (search == null || search.trim().isEmpty()) ? null : search.trim();
        String categoryParam = (category == null || category.trim().isEmpty()) ? null : category.trim();

        return productRepository.searchProducts(searchParam, categoryParam, sort)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProductResponse getProductById(
            Long id) {

        return mapToResponse(
                getProductEntityById(id));
    }

    public ProductResponse updateProduct(
            Long id,
            ProductRequest request) {

        Product product =
                getProductEntityById(id);

        product.setName(request.getName());
        product.setDescription(
                request.getDescription());
        product.setPrice(
                request.getPrice());
        product.setStock(
                request.getStock());
        product.setCategory(
                request.getCategory());
        product.setImageUrl(
                request.getImageUrl());

        Product updatedProduct =
                productRepository.save(product);

        return mapToResponse(updatedProduct);
    }

    public void deleteProduct(
            Long id) {

        Product product =
                getProductEntityById(id);

        productRepository.delete(product);
    }
}