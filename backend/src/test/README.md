# Cart Management Test Suite

This directory contains comprehensive tests for the cart management system in SiteCraft.

## Test Structure

### 1. Unit Tests (`CartServiceTest.java`)
- **Location**: `Services/CartServiceTest.java`
- **Purpose**: Tests individual methods of CartService in isolation using mocks
- **Coverage**: 
  - Cart retrieval by customer ID
  - Adding products to cart (new and existing)
  - Stock validation (including cumulative quantities)
  - Removing products from cart
  - Updating product quantities
  - Clearing cart
  - Discount calculations (percentage and amount)
  - DTO mapping
  - Edge cases and error scenarios

### 2. Integration Tests (`CartServiceIntegrationTest.java`)
- **Location**: `Services/CartServiceIntegrationTest.java`
- **Purpose**: Tests complete workflows with real database interactions
- **Coverage**:
  - Complete cart workflow (add → update → remove → clear)
  - Stock validation with multiple products
  - Discount calculation integration
  - Cart clearing with database verification
  - Edge cases with real data
  - Concurrent stock validation

### 3. Controller Tests (`CartControllerTest.java`)
- **Location**: `Controllers/CartControllerTest.java`
- **Purpose**: Tests REST API endpoints and session management
- **Coverage**:
  - All cart endpoints (GET, POST, PUT, DELETE)
  - Session-based authentication
  - Request/response validation
  - Error handling (unauthorized, not found, bad request)
  - JSON serialization/deserialization

### 4. Test Suite (`CartManagementTestSuite.java`)
- **Location**: `CartManagementTestSuite.java`
- **Purpose**: Orchestrates all tests in logical order
- **Execution**: Runs unit tests → integration tests → controller tests

## Test Configuration

### Database
- Uses H2 in-memory database for testing
- Configuration: `application-test.properties`
- Auto-creates schema and cleans up after each test

### Dependencies
- JUnit 5 for test framework
- Mockito for mocking
- Spring Boot Test for integration testing
- H2 Database for in-memory testing

## Running Tests

### Run All Tests
```bash
# From backend directory
mvn test

# Run specific test suite
mvn test -Dtest=CartManagementTestSuite

# Run with coverage
mvn test jacoco:report
```

### Run Individual Test Classes
```bash
# Unit tests only
mvn test -Dtest=CartServiceTest

# Integration tests only
mvn test -Dtest=CartServiceIntegrationTest

# Controller tests only
mvn test -Dtest=CartControllerTest
```

### Run Specific Test Methods
```bash
# Run specific test method
mvn test -Dtest=CartServiceTest#testAddProductToCart_NewProduct_Success

# Run tests matching pattern
mvn test -Dtest=CartServiceTest#testAddProductToCart*
```

## Test Scenarios Covered

### Stock Validation
- ✅ Adding products within stock limits
- ✅ Adding products exceeding stock limits
- ✅ Cumulative quantity validation (existing + new)
- ✅ Updating quantities with stock validation
- ✅ Multiple products with different stock levels

### Discount Calculations
- ✅ Percentage discounts with max caps
- ✅ Amount discounts with min/max caps
- ✅ No discount scenarios
- ✅ Unknown discount types
- ✅ Discounts exceeding original price
- ✅ Integration with cart total calculation

### Cart Operations
- ✅ Adding new products
- ✅ Adding existing products (quantity accumulation)
- ✅ Updating quantities
- ✅ Removing products
- ✅ Clearing entire cart
- ✅ Cart total recalculation

### Error Handling
- ✅ Customer not found
- ✅ Product not found
- ✅ Variant not found
- ✅ Invalid quantities (zero, negative)
- ✅ Stock exceeded
- ✅ Unauthorized access

### Session Management
- ✅ Valid session with customer ID
- ✅ Missing session (unauthorized)
- ✅ Session with invalid customer ID

## Test Data

### Sample Products
- **Test Product**: $100.00, Stock: 10
- **Integration Test Product**: $150.00, Stock: 20
- **Variant 1**: SKU "TEST-SKU-001"
- **Variant 2**: SKU "INTEGRATION-SKU-001"

### Sample Discounts
- **Percentage**: 20% off with $50 max cap
- **Amount**: $25 off with $10 min cap and $30 max cap

### Sample Customers
- **Unit Test**: ID 1, Email: test@example.com
- **Integration Test**: ID auto-generated, Email: integration@test.com

## Assertions and Verifications

### Service Layer
- Method return values
- Database state changes
- Repository method calls
- Business logic validation

### Controller Layer
- HTTP status codes
- Response body content
- Session handling
- Request validation

### Integration Layer
- Complete workflow validation
- Database consistency
- Transaction rollback
- Real-world scenarios

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Cleanup**: Database is cleaned after each test
3. **Mocking**: External dependencies are mocked in unit tests
4. **Real Data**: Integration tests use real database interactions
5. **Edge Cases**: Comprehensive coverage of error scenarios
6. **Documentation**: Clear test names and comments explaining scenarios

## Debugging Tests

### Enable SQL Logging
```properties
# In application-test.properties
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
```

### H2 Console
- URL: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:testdb
- Username: sa
- Password: (empty)

### IDE Integration
- Run tests directly from IDE
- Debug individual test methods
- View test coverage reports
- Step through test execution

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- Fast execution (under 30 seconds)
- No external dependencies
- Consistent results
- Clear pass/fail indicators
- Coverage reporting

## Future Enhancements

- Performance tests for large cart operations
- Concurrent access testing
- Memory usage validation
- API contract testing
- Load testing for cart endpoints 