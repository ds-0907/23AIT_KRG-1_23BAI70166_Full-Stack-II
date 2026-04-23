package com.experiment9.config;

import com.experiment9.entity.ERole;
import com.experiment9.entity.Role;
import com.experiment9.entity.Product;
import com.experiment9.repository.RoleRepository;
import com.experiment9.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) {
        // Initialize roles if not present
        if (roleRepository.count() == 0) {
            roleRepository.save(Role.builder().name(ERole.ROLE_USER).build());
            roleRepository.save(Role.builder().name(ERole.ROLE_MODERATOR).build());
            roleRepository.save(Role.builder().name(ERole.ROLE_ADMIN).build());
            logger.info("✅ Roles initialized: USER, MODERATOR, ADMIN");
        }

        // Initialize sample products if not present
        if (productRepository.count() == 0) {
            productRepository.saveAll(Arrays.asList(
                Product.builder().name("Laptop").description("High-performance laptop").price(999.99).category("Electronics").stockQuantity(50).build(),
                Product.builder().name("Smartphone").description("Latest Android smartphone").price(699.99).category("Electronics").stockQuantity(100).build(),
                Product.builder().name("Headphones").description("Wireless noise-cancelling headphones").price(249.99).category("Electronics").stockQuantity(200).build(),
                Product.builder().name("Running Shoes").description("Lightweight running shoes").price(129.99).category("Sports").stockQuantity(150).build(),
                Product.builder().name("Yoga Mat").description("Non-slip premium yoga mat").price(49.99).category("Sports").stockQuantity(300).build(),
                Product.builder().name("Coffee Maker").description("Automatic drip coffee maker").price(89.99).category("Home").stockQuantity(80).build(),
                Product.builder().name("Desk Lamp").description("LED adjustable desk lamp").price(34.99).category("Home").stockQuantity(120).build(),
                Product.builder().name("Backpack").description("Waterproof travel backpack").price(79.99).category("Travel").stockQuantity(90).build()
            ));
            logger.info("✅ Sample products initialized (8 items)");
        }
    }
}
