package com.shopsphere.service;

import com.shopsphere.dto.CartRequest;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public CartItem addToCart(
        String email,
        CartRequest request) {

    User user =
            userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found"));

    Product product =
            productRepository.findById(
                    request.getProductId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Product not found"));

    CartItem cartItem =
            cartItemRepository
                    .findByUserAndProduct(
                            user,
                            product)
                    .orElse(null);

    if (cartItem != null) {

        cartItem.setQuantity(
                cartItem.getQuantity()
                        + request.getQuantity());

        return cartItemRepository.save(
                cartItem);
    }

    cartItem = CartItem.builder()
            .user(user)
            .product(product)
            .quantity(
                    request.getQuantity())
            .build();

    return cartItemRepository.save(
            cartItem);
}

    public List<CartItem> getCart(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        return cartItemRepository.findByUser(user);
    }

    public void removeFromCart(
            Long id) {

        CartItem cartItem =
                cartItemRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart item not found"));

        cartItemRepository.delete(cartItem);
    }
    public CartItem increaseQuantity(
        Long id) {

    CartItem cartItem =
            cartItemRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Cart item not found"));

    cartItem.setQuantity(
            cartItem.getQuantity() + 1);

    return cartItemRepository.save(
            cartItem);
}

public CartItem decreaseQuantity(
        Long id) {

    CartItem cartItem =
            cartItemRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Cart item not found"));

    if (cartItem.getQuantity() > 1) {

        cartItem.setQuantity(
                cartItem.getQuantity() - 1);

        return cartItemRepository.save(
                cartItem);
    }

    cartItemRepository.delete(
            cartItem);

    return null;
}
}