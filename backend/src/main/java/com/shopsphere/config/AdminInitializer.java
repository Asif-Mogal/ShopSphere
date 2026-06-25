package com.shopsphere.config;

import com.shopsphere.entity.User;
import com.shopsphere.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public AdminInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        userRepository.findByEmail("mogalasif2003@gmail.com").ifPresent(user -> {
            if (!"ADMIN".equals(user.getRole())) {
                user.setRole("ADMIN");
                userRepository.save(user);
                System.out.println("==================================================");
                System.out.println("SUCCESS: Elevated mogalasif2003@gmail.com to ADMIN");
                System.out.println("==================================================");
            }
        });
    }
}
