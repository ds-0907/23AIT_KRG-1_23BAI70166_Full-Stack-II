package com.experiment9.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_name", columnList = "name"),
    @Index(name = "idx_product_category", columnList = "category")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedQueries({
    @NamedQuery(name = "Product.findByCategory",
                query = "SELECT p FROM Product p WHERE p.category = :category"),
    @NamedQuery(name = "Product.findByPriceRange",
                query = "SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(length = 50)
    private String category;

    @Column(nullable = false)
    private Integer stockQuantity;
}
