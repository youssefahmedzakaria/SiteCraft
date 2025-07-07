package com.sitecraft.backend.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class PaymobService {

    // Replace with your actual Paymob credentials and iframe ID
    private static final String API_KEY = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBMU9ETTRPQ3dpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS51T1NjSV9HZ3hfNVQteXdOQS1DVjRSNzJ0STVudmVoZkVLTmtkQ3FDdDRoMkN0WmxuXzR6V3hxLUo3Q0V4cTRoUDBWb2JsNDd4VldLMU01QWlGQlBpUQ==";
    private static final String IFRAME_ID = "937835";

    public String createPaymentSession(String paymentMethod, String wallet, String mobile, Double amount) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // 1. Authenticate with Paymob
            Map<String, String> authBody = new HashMap<>();
            authBody.put("api_key", API_KEY);
            ResponseEntity<Map> authResponse = restTemplate.postForEntity(
                    "https://accept.paymob.com/api/auth/tokens", authBody, Map.class);
            String token = (String) authResponse.getBody().get("token");

            // 2. Create Order
            Map<String, Object> orderBody = new HashMap<>();
            orderBody.put("auth_token", token);
            orderBody.put("delivery_needed", "false");
            orderBody.put("amount_cents", (int)(amount * 100));
            orderBody.put("currency", "EGP");
            orderBody.put("items", new ArrayList<>());
            ResponseEntity<Map> orderResponse = restTemplate.postForEntity(
                    "https://accept.paymob.com/api/ecommerce/orders", orderBody, Map.class);
            Integer orderId = (Integer) orderResponse.getBody().get("id");

            // 3. Generate Payment Key
            Map<String, Object> paymentKeyBody = new HashMap<>();
            paymentKeyBody.put("auth_token", token);
            paymentKeyBody.put("amount_cents", (int)(amount * 100));
            paymentKeyBody.put("expiration", 3600);
            paymentKeyBody.put("order_id", orderId);
            paymentKeyBody.put("currency", "EGP");
            paymentKeyBody.put("integration_id", getIntegrationId(paymentMethod, wallet));
            Map<String, Object> billingData = new HashMap<>();
            billingData.put("phone_number", mobile != null ? mobile : "01000000000");
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

            ResponseEntity<Map> paymentKeyResponse = restTemplate.postForEntity(
                    "https://accept.paymob.com/api/acceptance/payment_keys", paymentKeyBody, Map.class);
            String paymentToken = (String) paymentKeyResponse.getBody().get("token");

            // 4. Return the iframe URL
            return "https://accept.paymob.com/api/acceptance/iframes/" + IFRAME_ID + "?payment_token=" + paymentToken;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // You must map paymentMethod/wallet to the correct integration_id from your Paymob dashboard
    private int getIntegrationId(String paymentMethod, String wallet) {
        // Example mapping (replace with your real integration IDs)
        if ("card".equals(paymentMethod)) return 123456;
        if ("valu".equals(paymentMethod)) return 234567;
        if ("ewallet".equals(paymentMethod)) {
            if ("vodafone".equals(wallet)) return 345678;
            if ("etisalat".equals(wallet)) return 456789;
            if ("orange".equals(wallet)) return 567890;
        }
        return 0;
    }
}