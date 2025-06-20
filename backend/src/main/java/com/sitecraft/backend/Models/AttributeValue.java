package com.sitecraft.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "attributevalue")
public class AttributeValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attribute_value")
    private String attributeValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_attribute_id")
    @JsonIgnore
    private ProductAttribute productAttribute;

    @OneToMany(mappedBy = "attributeValue")
    private List<VariantAttributeValue> variantAttributeValues;

    public AttributeValue() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAttributeValue() {
        return attributeValue;
    }

    public void setAttributeValue(String attributeValue) {
        this.attributeValue = attributeValue;
    }

    public ProductAttribute getProductAttribute() {
        return productAttribute;
    }

    public void setProductAttribute(ProductAttribute productAttribute) {
        this.productAttribute = productAttribute;
    }

    public List<VariantAttributeValue> getVariantAttributeValues() {
        return variantAttributeValues;
    }

    public void setVariantAttributeValues(List<VariantAttributeValue> variantAttributeValues) {
        this.variantAttributeValues = variantAttributeValues;
    }
} 