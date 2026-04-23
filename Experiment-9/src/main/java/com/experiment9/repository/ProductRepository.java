package com.experiment9.repository;

import com.experiment9.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Pagination support for scalability
    Page<Product> findAll(Pageable pageable);

    // Custom optimized queries
    List<Product> findByCategory(String category);

    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max ORDER BY p.price ASC")
    List<Product> findByPriceRange(@Param("min") Double min, @Param("max") Double max);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchByName(@Param("keyword") String keyword, Pageable pageable);

    // Bulk update for performance
    @Modifying
    @Query("UPDATE Product p SET p.price = p.price * :factor WHERE p.category = :category")
    int updatePriceByCategory(@Param("category") String category, @Param("factor") Double factor);
}
