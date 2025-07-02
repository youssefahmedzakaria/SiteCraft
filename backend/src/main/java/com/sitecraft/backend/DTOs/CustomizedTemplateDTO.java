package com.sitecraft.backend.DTOs;

import com.fasterxml.jackson.databind.JsonNode;

public record CustomizedTemplateDTO(
        String title,
        JsonNode value,
        Integer index
) {}