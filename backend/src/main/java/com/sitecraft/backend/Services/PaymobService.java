package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.PaymentLog;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.PaymentLogRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;
import java.time.LocalDateTime;

@Service
public class PaymobService {

    @Autowired
    private PaymentLogRepo paymentLogRepository;

    @Autowired
    private StoreRepo storeRepository;

    // Replace with your actual Paymob credentials and iframe ID
    private static final String API_KEY = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBMU9ETTRPQ3dpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS51T1NjSV9HZ3hfNVQteXdOQS1DVjRSNzJ0STVudmVoZkVLTmtkQ3FDdDRoMkN0WmxuXzR6V3hxLUo3Q0V4cTRoUDBWb2JsNDd4VldLMU01QWlGQlBpUQ==";
    private static final String IFRAME_ID = "937835";

    public String createPaymentSession(String paymentMethod, String wallet, String mobile, Double amount) {
        try {
            System.out.println("Creating Paymob session with: paymentMethod=" + paymentMethod + ", wallet=" + wallet + ", mobile=" + mobile + ", amount=" + amount);
            
            RestTemplate restTemplate = new RestTemplate();

            // 1. Authenticate with Paymob
            Map<String, String> authBody = new HashMap<>();
            authBody.put("api_key", API_KEY);
            System.out.println("Authenticating with Paymob...");
            ResponseEntity<Map> authResponse = restTemplate.postForEntity(
                    "https://accept.paymob.com/api/auth/tokens", authBody, Map.class);
            
            if (authResponse.getBody() == null) {
                System.err.println("Auth response body is null");
                return null;
            }
            
            String token = (String) authResponse.getBody().get("token");
            if (token == null) {
                System.err.println("Auth token is null. Response: " + authResponse.getBody());
                return null;
            }
            System.out.println("Authentication successful, token received");

            // 2. Create Order
            Map<String, Object> orderBody = new HashMap<>();
            orderBody.put("auth_token", token);
            orderBody.put("delivery_needed", "false");
            orderBody.put("amount_cents", (int)(amount * 100));
            orderBody.put("currency", "EGP");
            orderBody.put("items", new ArrayList<>());
            System.out.println("Creating Paymob order...");
            ResponseEntity<Map> orderResponse = restTemplate.postForEntity(
                    "https://accept.paymob.com/api/ecommerce/orders", orderBody, Map.class);
            
            if (orderResponse.getBody() == null) {
                System.err.println("Order response body is null");
                return null;
            }
            
            Integer orderId = (Integer) orderResponse.getBody().get("id");
            if (orderId == null) {
                System.err.println("Order ID is null. Response: " + orderResponse.getBody());
                return null;
            }
            System.out.println("Order created successfully, ID: " + orderId);

            // 3. Generate Payment Key
            Map<String, Object> paymentKeyBody = new HashMap<>();
            paymentKeyBody.put("auth_token", token);
            paymentKeyBody.put("amount_cents", (int)(amount * 100));
            paymentKeyBody.put("expiration", 3600);
            paymentKeyBody.put("order_id", orderId);
            paymentKeyBody.put("currency", "EGP");
            int integrationId = getIntegrationId(paymentMethod, wallet);
            paymentKeyBody.put("integration_id", integrationId);
            System.out.println("Using integration ID: " + integrationId);
            
            Map<String, Object> billingData = new HashMap<>();
            // Ensure we have a valid phone number
            String phoneNumber = mobile != null && !mobile.trim().isEmpty() ? mobile : "01000000000";
            billingData.put("phone_number", phoneNumber);
            billingData.put("email", "test@example.com");
            billingData.put("first_name", "Test");
            billingData.put("last_name", "User");
            billingData.put("apartment", "NA");
            billingData.put("floor", "NA");
            billingData.put("street", "NA");
            billingData.put("building", "NA");
            billingData.put("city", "NA");
            billingData.put("country", "NA");
            billingData.put("state", "NA");
            billingData.put("postal_code", "NA");
            paymentKeyBody.put("billing_data", billingData);

            System.out.println("Generating payment key...");
            ResponseEntity<Map> paymentKeyResponse = restTemplate.postForEntity(
                    "https://accept.paymob.com/api/acceptance/payment_keys", paymentKeyBody, Map.class);
            
            if (paymentKeyResponse.getBody() == null) {
                System.err.println("Payment key response body is null");
                return null;
            }
            
            String paymentToken = (String) paymentKeyResponse.getBody().get("token");
            if (paymentToken == null) {
                System.err.println("Payment token is null. Response: " + paymentKeyResponse.getBody());
                return null;
            }
            System.out.println("Payment key generated successfully");

            // 4. Return the iframe URL
            String iframeUrl = "https://accept.paymob.com/api/acceptance/iframes/" + IFRAME_ID + "?payment_token=" + paymentToken;
            System.out.println("Iframe URL generated: " + iframeUrl);
            return iframeUrl;
        } catch (Exception e) {
            System.err.println("Error in createPaymentSession: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public PaymentLog handlePaymentCompletion(String paymentMethod, String wallet, Double amount, Long storeId, String transactionId, String status) {
        try {
            // Create PaymentLog
            PaymentLog paymentLog = new PaymentLog();
            paymentLog.setAmount(amount);
            paymentLog.setTimestamp(LocalDateTime.now());
            paymentLog.setStatus(status);
            paymentLog.setMethod(getPaymentMethodString(paymentMethod, wallet));
            
            // Set store
            Store store = storeRepository.findById(storeId).orElse(null);
            if (store != null) {
                paymentLog.setStore(store);
            }

            // Save PaymentLog
            PaymentLog savedPaymentLog = paymentLogRepository.save(paymentLog);
            
            return savedPaymentLog;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getPaymentMethodString(String paymentMethod, String wallet) {
        if ("card".equals(paymentMethod)) return "Credit Card";
        if ("valu".equals(paymentMethod)) return "Valu";
        if ("ewallet".equals(paymentMethod)) {
            if ("vodafone".equals(wallet)) return "Vodafone Cash";
            if ("etisalat".equals(wallet)) return "Etisalat Cash";
            if ("orange".equals(wallet)) return "Orange Cash";
        }
        return "Unknown";
    }

    // You must map paymentMethod/wallet to the correct integration_id from your Paymob dashboard
    private int getIntegrationId(String paymentMethod, String wallet) {
        // For testing, use a default integration ID
        // In production, replace these with your real integration IDs from Paymob dashboard
        int defaultIntegrationId = 123456; // Replace with your actual default integration ID
        
        System.out.println("Payment method: " + paymentMethod + ", wallet: " + wallet);
        
        // Example mapping (replace with your real integration IDs)
        if ("card".equals(paymentMethod)) {
            System.out.println("Using card integration ID: " + defaultIntegrationId);
            return defaultIntegrationId;
        }
        if ("valu".equals(paymentMethod)) {
            System.out.println("Using valu integration ID: " + defaultIntegrationId);
            return defaultIntegrationId;
        }
        if ("ewallet".equals(paymentMethod)) {
            if ("vodafone".equals(wallet)) {
                System.out.println("Using vodafone integration ID: " + defaultIntegrationId);
                return defaultIntegrationId;
            }
            if ("etisalat".equals(wallet)) {
                System.out.println("Using etisalat integration ID: " + defaultIntegrationId);
                return defaultIntegrationId;
            }
            if ("orange".equals(wallet)) {
                System.out.println("Using orange integration ID: " + defaultIntegrationId);
                return defaultIntegrationId;
            }
        }
        
        System.out.println("Using default integration ID: " + defaultIntegrationId);
        return defaultIntegrationId;
    }
}