package com.sitecraft.backend.Config;

import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class DynamicDataSourceManager {

    private final Map<String, DataSource> dataSources = new ConcurrentHashMap<>();

    public void registerDataSource(String tenant, DataSource dataSource) {
        dataSources.put(tenant, dataSource);
    }

    public DataSource getDataSource(String tenant) {
        return dataSources.get(tenant);
    }

    public boolean isRegistered(String tenant) {
        return dataSources.containsKey(tenant);
    }
}
