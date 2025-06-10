package com.sitecraft.backend.Config;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Component
public class TenantRoutingDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        return TenantContext.getCurrentTenant();
    }

    public void addTenant(String tenantId, DataSource dataSource) {
        Map<Object, Object> targetDataSources = new HashMap<>(getTargetDataSources());
        targetDataSources.put(tenantId, dataSource);
        setTargetDataSources(targetDataSources);
        afterPropertiesSet();
    }
}