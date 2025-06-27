package com.sitecraft.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "variantattributevalue")
public class VariantAttributeValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    @JsonIgnore
    private ProductVariants variant;

    @ManyToOne
    @JoinColumn(name = "attribute_value_id")
    @JsonIgnore
    private AttributeValue attributeValue;

    public VariantAttributeValue() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductVariants getVariant() {
        return variant;
    }

    public void setVariant(ProductVariants variant) {
        this.variant = variant;
    }

    public AttributeValue getAttributeValue() {
        return attributeValue;
    }

    public void setAttributeValue(AttributeValue attributeValue) {
        this.attributeValue = attributeValue;
    }
} 