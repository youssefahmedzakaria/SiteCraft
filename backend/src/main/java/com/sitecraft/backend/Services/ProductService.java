package com.sitecraft.backend.Services;

import com.sitecraft.backend.DTOs.ProductCreateDTO;
import com.sitecraft.backend.DTOs.ProductVariantDTO;
import com.sitecraft.backend.DTOs.ProductAttributeDTO;
import com.sitecraft.backend.DTOs.VariantAttributeDTO;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.io.File;
import java.io.IOException;

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
 
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private OrderProductRepo orderProductRepo;
    @Autowired
    private WishListProductRepo wishListProductRepo;
    @Autowired
    private CartProductRepo cartProductRepo;
    @Autowired
    private CategoryProductRepo categoryProductRepo;
    @Autowired
    private ReviewRepo reviewRepo;
    @Autowired
    private AttributeValueRepo attributeValueRepo;
    @Autowired
    private ProductAttributeRepo productAttributeRepo;
    @Autowired
    private VariantAttributeValueRepo variantAttributeValueRepo;


    public List<Product> getAllProducts(Long storeId) {
        return productRepo.findByStoreIdWithCategory(storeId);
    }

    public Product getProductById(Long id, Long storeId) {
        return productRepo.findByIdAndStoreId(id, storeId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Transactional
    public Product createProduct(ProductCreateDTO productDTO, Long storeId) {
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setDiscountType(productDTO.getDiscountType());
        product.setDiscountValue(
            productDTO.getDiscountValue() == null ? null : BigDecimal.valueOf(productDTO.getDiscountValue())
        );
        product.setStore(store);

        Product savedProduct = productRepo.save(product);

        // Create CategoryProduct entries for many-to-many relationship
        List<Long> categoryIds = productDTO.getAllCategoryIds();
        if (categoryIds != null && !categoryIds.isEmpty()) {
            for (Long categoryId : categoryIds) {
                Category category = categoryRepo.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
                
                CategoryProduct categoryProduct = new CategoryProduct();
                categoryProduct.setCategory(category);
                categoryProduct.setProduct(savedProduct);
                categoryProductRepo.save(categoryProduct);
            }
        }

        Map<String, Map<String, AttributeValue>> createdAttributes = new HashMap<>();

        if (productDTO.getAttributes() != null && !productDTO.getAttributes().isEmpty()) {
            for (ProductAttributeDTO attrDTO : productDTO.getAttributes()) {
                ProductAttribute productAttribute = new ProductAttribute();
                productAttribute.setProduct(savedProduct);
                productAttribute.setAttributeName(attrDTO.getName());

                Map<String, AttributeValue> valueMap = new HashMap<>();
                List<AttributeValue> attributeValues = new ArrayList<>();

                for (String value : attrDTO.getValues()) {
                    AttributeValue attributeValue = new AttributeValue();
                    attributeValue.setAttributeValue(value);
                    attributeValue.setProductAttribute(productAttribute);
                    attributeValues.add(attributeValue);
                    valueMap.put(value, attributeValue);
                }
                productAttribute.setAttributeValues(attributeValues);
                productAttributeRepo.save(productAttribute);
                createdAttributes.put(attrDTO.getName(), valueMap);
            }
        }

        if (productDTO.getVariants() != null && !productDTO.getVariants().isEmpty()) {
            for (ProductVariantDTO variantDTO : productDTO.getVariants()) {
                ProductVariants variant = new ProductVariants();
                variant.setStock(variantDTO.getStock());
                variant.setPrice(variantDTO.getPrice());
                variant.setProductionCost(variantDTO.getProductionCost());
                variant.setProduct(savedProduct);

                ProductVariants savedVariant = productVariantsRepo.save(variant);
                List<String> attributePairsForSku = new ArrayList<>();

                if (variantDTO.getAttributes() != null && !variantDTO.getAttributes().isEmpty()) {
                    for (VariantAttributeDTO variantAttrDTO : variantDTO.getAttributes()) {
                        Map<String, AttributeValue> valueMap = createdAttributes.get(variantAttrDTO.getName());
                        if (valueMap != null) {
                            AttributeValue av = valueMap.get(variantAttrDTO.getValue());
                            if (av != null) {
                                VariantAttributeValue vav = new VariantAttributeValue();
                                vav.setVariant(savedVariant);
                                vav.setAttributeValue(av);
                                variantAttributeValueRepo.save(vav);
                                attributePairsForSku.add(variantAttrDTO.getName().toLowerCase() + "-" + variantAttrDTO.getValue().toLowerCase());
                            } else {
                                System.err.println("Warning: Attribute value not found for variant: " + variantAttrDTO.getValue());
                            }
                        } else {
                            System.err.println("Warning: Attribute name not found for variant: " + variantAttrDTO.getName());
                        }
                    }
                }

                Collections.sort(attributePairsForSku);
                String attributesString = String.join("|", attributePairsForSku);
                String generatedSku = savedProduct.getStore().getId() + "|" + savedProduct.getId();
                if (!attributesString.isEmpty()) {
                    generatedSku += "|" + attributesString;
                }
                variant.setSku(generatedSku);
                productVariantsRepo.save(variant);
            }
        }

        // Handle low stock notification settings after variants are created
        handleLowStockSettings(savedProduct, productDTO);

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
        
        List<Long> categoryIds = productDTO.getAllCategoryIds();
        if (categoryIds != null && !categoryIds.isEmpty()) {
            // Update the many-to-many relationship through CategoryProduct table
            // First, get existing CategoryProduct entries for this product
            List<CategoryProduct> existingCategoryProducts = categoryProductRepo.findByProductId(id);
            
            // Create a set of existing category IDs for quick lookup
            Set<Long> existingCategoryIds = existingCategoryProducts.stream()
                    .map(cp -> cp.getCategory().getId())
                    .collect(Collectors.toSet());
            
            // Create a set of new category IDs
            Set<Long> newCategoryIds = new HashSet<>(categoryIds);
            
            // Remove categories that are no longer needed
            List<CategoryProduct> toRemove = existingCategoryProducts.stream()
                    .filter(cp -> !newCategoryIds.contains(cp.getCategory().getId()))
                    .collect(Collectors.toList());
            categoryProductRepo.deleteAll(toRemove);
            
            // Add new categories that don't already exist
            for (Long categoryId : categoryIds) {
                if (!existingCategoryIds.contains(categoryId)) {
                    Category category = categoryRepo.findById(categoryId)
                            .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
                    
                    CategoryProduct categoryProduct = new CategoryProduct();
                    categoryProduct.setCategory(category);
                    categoryProduct.setProduct(product);
                    categoryProductRepo.save(categoryProduct);
                }
            }
        } else if (productDTO.getCategoryId() == null && productDTO.getCategoryIds() == null) {
            // If no categories are provided, remove all existing category relationships
            List<CategoryProduct> existingCategoryProducts = categoryProductRepo.findByProductId(id);
            categoryProductRepo.deleteAll(existingCategoryProducts);
        }

        // Only update variants and attributes if they are provided in the DTO
        if (productDTO.getAttributes() != null) {
            // Delete old attributes and variants in the correct order
            List<ProductVariants> variantsToDelete = new ArrayList<>(product.getVariants());
            for (ProductVariants variant : variantsToDelete) {
                List<VariantAttributeValue> vavsToDelete = variantAttributeValueRepo.findByVariant(variant);
                variantAttributeValueRepo.deleteAll(vavsToDelete);
            }
            productVariantsRepo.deleteAll(variantsToDelete);
            productAttributeRepo.deleteAll(product.getAttributes());

            product.getAttributes().clear();
            product.getVariants().clear();

            // Re-create attributes and variants
            Map<String, Map<String, AttributeValue>> createdAttributes = new HashMap<>();

            if (productDTO.getAttributes() != null && !productDTO.getAttributes().isEmpty()) {
                for (ProductAttributeDTO attrDTO : productDTO.getAttributes()) {
                    ProductAttribute productAttribute = new ProductAttribute();
                    productAttribute.setProduct(product);
                    productAttribute.setAttributeName(attrDTO.getName());

                    Map<String, AttributeValue> valueMap = new HashMap<>();
                    List<AttributeValue> attributeValues = new ArrayList<>();

                    for (String value : attrDTO.getValues()) {
                        AttributeValue attributeValue = new AttributeValue();
                        attributeValue.setAttributeValue(value);
                        attributeValue.setProductAttribute(productAttribute);
                        attributeValues.add(attributeValue);
                        valueMap.put(value, attributeValue);
                    }
                    productAttribute.setAttributeValues(attributeValues);
                    productAttributeRepo.save(productAttribute);
                    product.getAttributes().add(productAttribute);
                    createdAttributes.put(attrDTO.getName(), valueMap);
                }
            }

            if (productDTO.getVariants() != null && !productDTO.getVariants().isEmpty()) {
                for (ProductVariantDTO variantDTO : productDTO.getVariants()) {
                    ProductVariants variant = new ProductVariants();
                    variant.setStock(variantDTO.getStock());
                    variant.setPrice(variantDTO.getPrice());
                    variant.setProductionCost(variantDTO.getProductionCost());
                    variant.setProduct(product);

                    ProductVariants savedVariant = productVariantsRepo.save(variant);
                    product.getVariants().add(savedVariant);
                    List<String> attributePairsForSku = new ArrayList<>();

                    if (variantDTO.getAttributes() != null && !variantDTO.getAttributes().isEmpty()) {
                        for (VariantAttributeDTO variantAttrDTO : variantDTO.getAttributes()) {
                            Map<String, AttributeValue> valueMap = createdAttributes.get(variantAttrDTO.getName());
                            if (valueMap != null) {
                                AttributeValue av = valueMap.get(variantAttrDTO.getValue());
                                if (av != null) {
                                    VariantAttributeValue vav = new VariantAttributeValue();
                                    vav.setVariant(savedVariant);
                                    vav.setAttributeValue(av);
                                    variantAttributeValueRepo.save(vav);
                                    attributePairsForSku.add(variantAttrDTO.getName().toLowerCase() + "-" + variantAttrDTO.getValue().toLowerCase());
                                } else {
                                    System.err.println("Warning: Attribute value not found for variant: " + variantAttrDTO.getValue());
                                }
                            } else {
                                System.err.println("Warning: Attribute name not found for variant: " + variantAttrDTO.getName());
                            }
                        }
                    }

                    Collections.sort(attributePairsForSku);
                    String attributesString = String.join("|", attributePairsForSku);
                    String generatedSku = product.getStore().getId() + "|" + product.getId();
                     if (!attributesString.isEmpty()) {
                        generatedSku += "|" + attributesString;
                    }
                    variant.setSku(generatedSku);
                    productVariantsRepo.save(variant);
                }
            }
            
            // Handle low stock notification settings after variants are updated
            handleLowStockSettings(product, productDTO);
        }

        return productRepo.save(product);
    }

    @Transactional
    public void deleteProduct(Long id, Long storeId) {
        try {
            Product product = productRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // 1. Set productId to null in OrderProduct
            List<OrderProduct> orderProducts = orderProductRepo.findByProductId(id);
            for (OrderProduct op : orderProducts) {
                op.setProduct(null);
            }
            orderProductRepo.saveAll(orderProducts);

            // 2. Delete dependent entities in correct order
            // a. VariantAttributeValue (via ProductVariants)
            List<ProductVariants> variants = productVariantsRepo.findByProductId(id);
            for (ProductVariants variant : variants) {
                variantAttributeValueRepo.deleteAll(variantAttributeValueRepo.findAll().stream().filter(vav -> vav.getVariant().getId().equals(variant.getId())).toList());
            }
            // b. WishListProduct
            wishListProductRepo.deleteAll(wishListProductRepo.findAll().stream().filter(wlp -> wlp.getProduct().getId().equals(id)).toList());
            // c. CartProduct
            cartProductRepo.deleteAll(cartProductRepo.findAll().stream().filter(cp -> cp.getProduct().getId().equals(id)).toList());
            // d. CategoryProduct
            categoryProductRepo.deleteAll(categoryProductRepo.findAll().stream().filter(cp -> cp.getProduct().getId().equals(id)).toList());
            // e. Review
            reviewRepo.deleteAll(reviewRepo.findAll().stream().filter(r -> r.getProduct().getId().equals(id)).toList());
            // f. AttributeValue (via ProductAttribute)
            List<ProductAttribute> attributes = productAttributeRepo.findAll().stream().filter(attr -> attr.getProduct().getId().equals(id)).toList();
            for (ProductAttribute attr : attributes) {
                attributeValueRepo.deleteAll(attributeValueRepo.findAll().stream().filter(av -> av.getProductAttribute().getId().equals(attr.getId())).toList());
            }
            // g. ProductAttribute
            productAttributeRepo.deleteAll(attributes);
            // h. ProductVariants
            productVariantsRepo.deleteAll(variants);
            // i. ProductImage
            productImageRepo.deleteAll(productImageRepo.findByProductId(id));

            // 3. Delete the product itself
            productRepo.delete(product);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting product: " + e.getMessage(), e);
        }
    }

    /*
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
    */

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
                                                      Double discountValue, Long storeId) {
        List<Product> products = productRepo.findAllById(productIds);
        products = products.stream()
                .filter(p -> p.getStore().getId().equals(storeId))
                .collect(Collectors.toList());

        for (Product product : products) {
            product.setDiscountType(discountType);
            product.setDiscountValue(
                discountValue == null ? null : BigDecimal.valueOf(discountValue)
            );
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
                String imageUrl = "http://localhost:8080/uploads/products/" + "product" + productId + "/" + filename;
                
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

    @Transactional
    public Product createProductWithImages(ProductCreateDTO productDTO, Long storeId, List<MultipartFile> images) throws IOException {
        Product product = createProduct(productDTO, storeId);
        if (images != null && !images.isEmpty()) {
            saveProductImages(product.getStore().getId(), product.getId(), images, product);
        }
        return getProductById(product.getId(), storeId);
    }

    @Transactional
public Product updateProductWithImages(Long id, ProductCreateDTO productDTO, Long storeId, List<MultipartFile> images) throws IOException {
    // 1. update all the non-image fields
    Product product = updateProduct(id, productDTO, storeId);

    // 2. if the front-end sent any new files, just save them—
    //    leave existing images untouched
    if (images != null && !images.isEmpty()) {
        saveProductImages(product.getStore().getId(), product.getId(), images, product);
    }

    // 3. return updated product with both old + newly-added images
    return getProductById(product.getId(), storeId);
}


    private void saveProductImages(Long storeId,
                               Long productId,
                               List<MultipartFile> images,
                               Product product) throws IOException {
    String uploadDir = System.getProperty("user.dir")
                     + "/uploads/stores/" + storeId + "/products/";
    File dir = new File(uploadDir);
    if (!dir.exists()) dir.mkdirs();

    String slug = product.getName()
                         .toLowerCase()
                         .replaceAll("[^a-z0-9]+", "-");

    for (MultipartFile image : images) {
        if (image.isEmpty()) continue;

        // preserve original file extension
        String original = image.getOriginalFilename();
        String ext = (original != null && original.contains("."))
                     ? original.substring(original.lastIndexOf("."))
                     : ".png";

        // use a millisecond timestamp for uniqueness
        String filename = String.format("%s_%d_%d_%d%s",
            slug, storeId, productId, System.currentTimeMillis(), ext);

        File dest = new File(dir, filename);
        image.transferTo(dest);

        ProductImage pi = new ProductImage();
        pi.setImageUrl("http://localhost:8080/uploads/stores/"
                       + storeId + "/products/" + filename);
        pi.setAlt(product.getName() + " image");
        pi.setProduct(product);
        productImageRepo.save(pi);
    }
}
    @Transactional
    public void deleteProductImage(Long productId, Long imageId, Long storeId) {
        // 1. Fetch the product and check it belongs to the store
        Product product = productRepo.findByIdAndStoreId(productId, storeId)
            .orElseThrow(() -> new RuntimeException("Product not found or does not belong to store"));

        // 2. Find the image
        ProductImage image = productImageRepo.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Image not found"));

        // 3. Check the image belongs to the product
        if (!image.getProduct().getId().equals(productId)) {
            throw new RuntimeException("Image does not belong to this product");
        }

        // 4. Delete the file from disk
        String imageUrl = image.getImageUrl();
        String relativePath;
        if (imageUrl.startsWith("http://localhost:8080")) {
            relativePath = imageUrl.substring("http://localhost:8080".length());
        } else {
            relativePath = imageUrl;
        }
        String path = System.getProperty("user.dir") + relativePath;
        File file = new File(path);
        if (file.exists()) file.delete();

        // 5. Remove the image from the product and delete from DB
        product.getImages().remove(image);
        productImageRepo.delete(image);
        productRepo.save(product);
    }
    
    /**
     * Handle low stock notification settings for a product
     */
    private void handleLowStockSettings(Product product, ProductCreateDTO productDTO) {
        if (productDTO.getLowStockEnabled() != null && productDTO.getLowStockEnabled()) {
            // Calculate total stock capacity from variants
            BigDecimal totalStockCapacity = BigDecimal.ZERO;
            if (productDTO.getVariants() != null) {
                totalStockCapacity = productDTO.getVariants().stream()
                        .mapToDouble(variant -> variant.getStock())
                        .mapToObj(BigDecimal::valueOf)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            }
            
            // Always set maxCap to total stock capacity (current stock)
            product.setMaxCap(totalStockCapacity);
            
            if ("percentage".equals(productDTO.getLowStockType())) {
                // Percentage-based: Store percentage and calculate minCap from it
                if (productDTO.getLowStockThreshold() != null) {
                    product.setPercentageMax(BigDecimal.valueOf(productDTO.getLowStockThreshold()));
                    // Calculate minCap = percentageMax * maxCap / 100
                    if (totalStockCapacity.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal minCapFromPercentage = BigDecimal.valueOf(productDTO.getLowStockThreshold())
                                .multiply(totalStockCapacity)
                                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                        product.setMinCap(minCapFromPercentage);
                    }
                }
            } else if ("number".equals(productDTO.getLowStockType())) {
                // Number-based: Set minCap directly to user's threshold
                if (productDTO.getLowStockThreshold() != null) {
                    product.setMinCap(BigDecimal.valueOf(productDTO.getLowStockThreshold()));
                    product.setPercentageMax(null); // Clear percentage for number-based
                }
            }
        } else {
            // Disable low stock notification
            product.setMinCap(null);
            product.setPercentageMax(null);
            product.setMaxCap(null);
        }
    }
}