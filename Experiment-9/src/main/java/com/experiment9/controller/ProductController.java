package com.experiment9.controller;

import com.experiment9.entity.Product;
import com.experiment9.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProductController {

    @Autowired
    private ProductService productService;

    // GET – Paginated product list (accessible by USER, MODERATOR, ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        return ResponseEntity.ok(productService.getAllProducts(page, size, sortBy));
    }

    // GET – Single product by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET – Products by category
    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    // GET – Search products by name keyword (paginated)
    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productService.searchProducts(keyword, page, size));
    }

    // GET – Products by price range
    @GetMapping("/price-range")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getByPriceRange(
            @RequestParam Double min,
            @RequestParam Double max) {
        return ResponseEntity.ok(productService.getProductsByPriceRange(min, max));
    }

    // POST – Create product (ADMIN only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    // POST – Batch insert products (ADMIN only)
    @PostMapping("/batch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> batchInsert(@RequestBody List<Product> products) {
        return ResponseEntity.ok(productService.batchInsertProducts(products));
    }

    // PUT – Update product (ADMIN or MODERATOR)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                  @Valid @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    // PUT – Bulk price update by category (ADMIN only)
    @PutMapping("/update-prices")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateCategoryPrices(
            @RequestParam String category,
            @RequestParam Double factor) {
        int updated = productService.updateCategoryPrices(category, factor);
        return ResponseEntity.ok(updated + " products updated successfully.");
    }

    // DELETE – Delete product (ADMIN only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully.");
    }
}
