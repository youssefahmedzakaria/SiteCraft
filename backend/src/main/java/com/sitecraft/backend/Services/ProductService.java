package com.sitecraft.backend.Services;

import com.sitecraft.backend.DTOs.ProductCreateDTO;
import com.sitecraft.backend.DTOs.ProductVariantDTO;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepo productRepo;
    
    @Autowired
    private ProductVariantsRepo productVariantsRepo;
      @Autowired
    private ProductImageRepo productImageRepo;
    
    @Autowired
    private CategoryRepo categoryRepo;
    
    @Autowired
    private StoreRepo storeRepo;

    public List<Product> getAllProducts(Long storeId) {
        return productRepo.findByStoreId(storeId);
    }

    public Product getProductById(Long id, Long storeId) {
        return productRepo.findByIdAndStoreId(id, storeId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Transactional
    public Product createProduct(ProductCreateDTO productDTO, Long storeId) {
        // Get store and category
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        
        Category category = categoryRepo.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Create product
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setDiscountType(productDTO.getDiscountType());
        product.setDiscountValue(
            productDTO.getDiscountValue() == null ? null : BigDecimal.valueOf(productDTO.getDiscountValue())
        );
        product.setMinCap(productDTO.getMinCap() == null ? null : BigDecimal.valueOf(productDTO.getMinCap()));
        product.setPercentageMax(productDTO.getPercentageMax() == null ? null : BigDecimal.valueOf(productDTO.getPercentageMax()));
        product.setMaxCap(productDTO.getMaxCap() == null ? null : BigDecimal.valueOf(productDTO.getMaxCap()));
        product.setCategory(category);
        product.setStore(store);

        Product savedProduct = productRepo.save(product);

        // Save variants if provided
        if (productDTO.getVariants() != null && !productDTO.getVariants().isEmpty()) {
            for (ProductVariantDTO variantDTO : productDTO.getVariants()) {
                ProductVariants variant = new ProductVariants();
                variant.setSku(variantDTO.getSku());
                variant.setStock(variantDTO.getStock());
                variant.setPrice(variantDTO.getPrice());
                variant.setProductionCost(variantDTO.getProductionCost());
                variant.setProduct(savedProduct);
                productVariantsRepo.save(variant);
            }
        }

        // Save images if provided
        if (productDTO.getImageUrls() != null && !productDTO.getImageUrls().isEmpty()) {
            for (String imageUrl : productDTO.getImageUrls()) {
                ProductImage image = new ProductImage();
                image.setImageUrl(imageUrl);
                image.setAlt(savedProduct.getName() + " image");
                image.setProduct(savedProduct);
                productImageRepo.save(image);
            }
        }

        return savedProduct;
    }

    @Transactional
    public Product updateProduct(Long id, ProductCreateDTO productDTO, Long storeId) {
        Product product = productRepo.findByIdAndStoreId(id, storeId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (productDTO.getName() != null) product.setName(productDTO.getName());
        if (productDTO.getDescription() != null) product.setDescription(productDTO.getDescription());
        if (productDTO.getDiscountType() != null) product.setDiscountType(productDTO.getDiscountType());
        if (productDTO.getDiscountValue() != null) product.setDiscountValue(
            productDTO.getDiscountValue() == null ? null : BigDecimal.valueOf(productDTO.getDiscountValue())
        );
        if (productDTO.getMinCap() != null) product.setMinCap(productDTO.getMinCap() == null ? null : BigDecimal.valueOf(productDTO.getMinCap()));
        if (productDTO.getPercentageMax() != null) product.setPercentageMax(productDTO.getPercentageMax() == null ? null : BigDecimal.valueOf(productDTO.getPercentageMax()));
        if (productDTO.getMaxCap() != null) product.setMaxCap(productDTO.getMaxCap() == null ? null : BigDecimal.valueOf(productDTO.getMaxCap()));
        
        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepo.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        return productRepo.save(product);
    }    @Transactional
    public void deleteProduct(Long id, Long storeId) {
        try {
            Product product = productRepo.findByIdAndStoreId(id, storeId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            System.out.println("Starting deletion process for product ID: " + id);
            
            // Delete in the correct order based on foreign key dependencies
            deleteProductDependencies(id);
            
            // Finally delete the product itself
            productRepo.delete(product);
            
            System.out.println("Product deletion completed successfully for ID: " + id);
            
        } catch (Exception e) {
            System.err.println("Error deleting product: " + e.getMessage());
            throw new RuntimeException("Error deleting product: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void deleteProductDependencies(Long productId) {
        System.out.println("Deleting dependencies for product ID: " + productId);
        
        // Step 1: Delete VariantAttributeValue (references ProductVariants)
        try {
            productRepo.deleteVariantAttributeValuesByProductId(productId);
            System.out.println("Deleted variant attribute values");
        } catch (Exception e) {
            System.out.println("Note: Could not delete variant attribute values: " + e.getMessage());
        }
        
        // Step 2: Delete OrderProduct (references Product)
        try {
            productRepo.deleteOrderProductsByProductId(productId);
            System.out.println("Deleted order products");
        } catch (Exception e) {
            System.out.println("Note: Could not delete order products: " + e.getMessage());
        }
        
        // Step 3: Delete WishListProduct (references Product)
        try {
            productRepo.deleteWishListProductsByProductId(productId);
            System.out.println("Deleted wishlist products");
        } catch (Exception e) {
            System.out.println("Note: Could not delete wishlist products: " + e.getMessage());
        }
        
        // Step 4: Delete CartProduct (references Product)
        try {
            productRepo.deleteCartProductsByProductId(productId);
            System.out.println("Deleted cart products");
        } catch (Exception e) {
            System.out.println("Note: Could not delete cart products: " + e.getMessage());
        }
        
        // Step 5: Delete CategoryProduct (references Product)
        try {
            productRepo.deleteCategoryProductsByProductId(productId);
            System.out.println("Deleted category products");
        } catch (Exception e) {
            System.out.println("Note: Could not delete category products: " + e.getMessage());
        }
        
        // Step 6: Delete Review (references Product)
        try {
            productRepo.deleteReviewsByProductId(productId);
            System.out.println("Deleted reviews");
        } catch (Exception e) {
            System.out.println("Note: Could not delete reviews: " + e.getMessage());
        }
        
        // Step 7: Delete AttributeValue (references ProductAttribute)
        try {
            productRepo.deleteAttributeValuesByProductId(productId);
            System.out.println("Deleted attribute values");
        } catch (Exception e) {
            System.out.println("Note: Could not delete attribute values: " + e.getMessage());
        }
        
        // Step 8: Delete ProductAttribute (references Product)
        try {
            productRepo.deleteProductAttributesByProductId(productId);
            System.out.println("Deleted product attributes");
        } catch (Exception e) {
            System.out.println("Note: Could not delete product attributes: " + e.getMessage());
        }
        
        // Step 9: Delete ProductVariants (references Product)
        try {
            productVariantsRepo.deleteByProductId(productId);
            System.out.println("Deleted product variants");
        } catch (Exception e) {
            System.out.println("Note: Could not delete product variants: " + e.getMessage());
        }
        
        // Step 10: Delete ProductImage (references Product)
        try {
            productImageRepo.deleteByProductId(productId);
            System.out.println("Deleted product images");
        } catch (Exception e) {
            System.out.println("Note: Could not delete product images: " + e.getMessage());
        }
    }

    public List<Product> filterProducts(String category, String stockStatus, String search, Long storeId) {
        Long categoryId = null;
        if (category != null && !category.isEmpty()) {
            Optional<Category> categoryEntity = categoryRepo.findByNameAndStoreId(category, storeId);
            if (categoryEntity.isPresent()) {
                categoryId = categoryEntity.get().getId();
            }
        }

        return productRepo.findProductsWithFilters(storeId, categoryId, search);
    }

    public Map<String, Object> getProductStatistics(Long storeId) {
        Map<String, Object> stats = new HashMap<>();
        
        List<Product> allProducts = productRepo.findByStoreId(storeId);
        stats.put("totalProducts", allProducts.size());
        
        // Calculate low stock and out of stock
        int lowStockCount = 0;
        int outOfStockCount = 0;
        
        for (Product product : allProducts) {
            List<ProductVariants> variants = productVariantsRepo.findByProductId(product.getId());
            int totalStock = variants.stream().mapToInt(ProductVariants::getStock).sum();
            
            if (totalStock == 0) {
                outOfStockCount++;
            } else if (totalStock < 10) {
                lowStockCount++;
            }
        }
        
        stats.put("lowStockCount", lowStockCount);
        stats.put("outOfStockCount", outOfStockCount);
        
        return stats;
    }

    public List<Product> getLowStockItems(Long storeId) {
        List<Product> allProducts = productRepo.findByStoreId(storeId);
        return allProducts.stream()
                .filter(product -> {
                    List<ProductVariants> variants = productVariantsRepo.findByProductId(product.getId());
                    int totalStock = variants.stream().mapToInt(ProductVariants::getStock).sum();
                    return totalStock > 0 && totalStock < 10;
                })
                .collect(Collectors.toList());
    }

    public List<Product> getOutOfStockItems(Long storeId) {
        List<Product> allProducts = productRepo.findByStoreId(storeId);
        return allProducts.stream()
                .filter(product -> {
                    List<ProductVariants> variants = productVariantsRepo.findByProductId(product.getId());
                    int totalStock = variants.stream().mapToInt(ProductVariants::getStock).sum();
                    return totalStock == 0;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> applyDiscountToProducts(List<Long> productIds, String discountType, 
                                                      Double discountValue, Double minCap, 
                                                      Double percentageMax, Double maxCap, Long storeId) {
        List<Product> products = productRepo.findAllById(productIds);
        products = products.stream()
                .filter(p -> p.getStore().getId().equals(storeId))
                .collect(Collectors.toList());

        for (Product product : products) {
            product.setDiscountType(discountType);
            product.setDiscountValue(
                discountValue == null ? null : BigDecimal.valueOf(discountValue)
            );
            product.setMinCap(minCap == null ? null : BigDecimal.valueOf(minCap));
            product.setPercentageMax(percentageMax == null ? null : BigDecimal.valueOf(percentageMax));
            product.setMaxCap(maxCap == null ? null : BigDecimal.valueOf(maxCap));
        }

        productRepo.saveAll(products);

        Map<String, Object> result = new HashMap<>();
        result.put("updatedProducts", products.size());
        result.put("message", "Discount applied successfully to " + products.size() + " products");

        return result;
    }

    @Transactional
    public List<String> uploadProductImages(Long productId, List<MultipartFile> images, Long storeId) {
        try {
            Product product = productRepo.findByIdAndStoreId(productId, storeId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            List<String> imageUrls = new ArrayList<>();

            for (MultipartFile image : images) {
                // Validate the file
                if (image.isEmpty()) {
                    continue;
                }
                
                // Check file type
                String contentType = image.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new RuntimeException("File must be an image");
                }
                
                // Generate unique filename
                String originalFilename = image.getOriginalFilename();
                String extension = originalFilename != null ? 
                        originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String filename = "product_" + productId + "_" + System.currentTimeMillis() + extension;
                
                // For now, simulate file storage (replace with actual file upload logic)
                String imageUrl = "/uploads/products/" + productId + "/" + filename;
                
                // Save to database
                ProductImage productImage = new ProductImage();
                productImage.setImageUrl(imageUrl);
                productImage.setAlt(product.getName() + " image");
                productImage.setProduct(product);
                productImageRepo.save(productImage);

                imageUrls.add(imageUrl);
            }

            return imageUrls;
        } catch (Exception e) {
            throw new RuntimeException("Error uploading images: " + e.getMessage(), e);
        }
    }
}