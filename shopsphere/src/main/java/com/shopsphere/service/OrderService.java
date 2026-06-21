package com.shopsphere.service;

import com.shopsphere.dto.OrderItemResponse;
import com.shopsphere.dto.OrderResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BusinessException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(
            UserRepository userRepository,
            CartItemRepository cartItemRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository) {

        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public Order placeOrder(String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        List<CartItem> cartItems =
                cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new BusinessException(
                    "Cart is empty");
        }

        double totalAmount = 0;

        for (CartItem item : cartItems) {
            totalAmount +=
                    item.getProduct().getPrice()
                            * item.getQuantity();
        }

        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status("PLACED")
                .createdAt(LocalDateTime.now())
                .build();

        order = orderRepository.save(order);

        for (CartItem item : cartItems) {

            OrderItem orderItem =
                    OrderItem.builder()
                            .order(order)
                            .product(item.getProduct())
                            .quantity(item.getQuantity())
                            .price(item.getProduct().getPrice())
                            .build();

            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteAll(cartItems);

        return order;
    }

    public List<OrderResponse> getOrders(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        return orderRepository.findByUser(user)
                .stream()
                .map(order ->
                        OrderResponse.builder()
                                .id(order.getId())
                                .status(order.getStatus())
                                .totalAmount(
                                        order.getTotalAmount())
                                .createdAt(
                                        order.getCreatedAt())
                                .items(
                                        order.getItems()
                                                .stream()
                                                .map(item ->
                                                        OrderItemResponse.builder()
                                                                .productName(
                                                                        item.getProduct()
                                                                                .getName())
                                                                .quantity(
                                                                        item.getQuantity())
                                                                .price(
                                                                        item.getPrice())
                                                                .build()
                                                )
                                                .collect(
                                                        Collectors.toList())
                                )
                                .build()
                )
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(
            String email,
            Long orderId) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        Order order =
                orderRepository
                        .findByIdAndUser(
                                orderId,
                                user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found"));

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(
                        order.getItems()
                                .stream()
                                .map(item ->
                                        OrderItemResponse.builder()
                                                .productName(
                                                        item.getProduct()
                                                                .getName())
                                                .quantity(
                                                        item.getQuantity())
                                                .price(
                                                        item.getPrice())
                                                .build()
                                )
                                .collect(Collectors.toList())
                )
                .build();
    }
}