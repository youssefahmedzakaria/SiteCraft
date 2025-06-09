//package com.sitecraft.backend.Config;
//
//import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
//
//public class MultiStoreDataSource extends AbstractRoutingDataSource {
//    @Override
//    protected Object determineCurrentLookupKey() {
//        return StoreContext.getCurrentStore(); // e.g., returns "tenant_db_1"
//    }
//}
//
