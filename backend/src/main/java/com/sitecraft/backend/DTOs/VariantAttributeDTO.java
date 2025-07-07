package com.sitecraft.backend.DTOs;

import java.io.Serializable;

public class VariantAttributeDTO implements Serializable {
    private String name;
    private String value;

    public VariantAttributeDTO() {}

    public VariantAttributeDTO(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
} 