package com.sitecraft.backend.DTOs;

import java.io.Serializable;
import java.util.List;

public class VariantInfoDTO implements Serializable {
    private List<VariantAttributeDTO> attributes;

    public VariantInfoDTO() {}

    public VariantInfoDTO(List<VariantAttributeDTO> attributes) {
        this.attributes = attributes;
    }

    public List<VariantAttributeDTO> getAttributes() { return attributes; }
    public void setAttributes(List<VariantAttributeDTO> attributes) { this.attributes = attributes; }
} 