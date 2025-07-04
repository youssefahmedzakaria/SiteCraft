package com.sitecraft.backend.Converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.postgresql.util.PGobject;

import java.sql.SQLException;

@Converter
public class JsonbConverter implements AttributeConverter<String, Object> {

    @Override
    public Object convertToDatabaseColumn(String jsonData) {
        if (jsonData == null) {
            return null;
        }
        
        try {
            PGobject jsonObject = new PGobject();
            jsonObject.setType("jsonb");
            jsonObject.setValue(jsonData);
            return jsonObject;
        } catch (SQLException e) {
            throw new RuntimeException("Failed to convert JSON data to JSONB", e);
        }
    }

    @Override
    public String convertToEntityAttribute(Object dbData) {
        if (dbData == null) {
            return null;
        }
        
        if (dbData instanceof PGobject) {
            return ((PGobject) dbData).getValue();
        }
        
        return dbData.toString();
    }
}
