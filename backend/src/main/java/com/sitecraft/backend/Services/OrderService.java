package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import com.sitecraft.backend.DTOs.OrderExportDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
public class OrderService {
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private StoreRepo storeRepo;
    @Autowired
    private ShippingRepo shippingRepo;
    @Autowired
    private ProductVariantsRepo productVariantsRepo;
    @Autowired
    private OrderProductRepo orderProductRepo;
    @Autowired
    private AddressRepo addressRepo;
    @Autowired
    private PaymentLogRepo paymentLogRepo;
    @Autowired
    private ShippingInfoRepo shippingInfoRepo;
    @Autowired
    private CartService cartService;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private LowStockNotificationService lowStockNotificationService;


    public List<Order> getAllOrders(Long storeId) {
        Store existingStore = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        return orderRepo.findByStoreId(existingStore.getId());
    }

    public Order getOrder(Long orderId, Long storeId) {
        Optional<Order> optionalOrder = orderRepo.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found.");
        }

        Order order = optionalOrder.get();

        // Validate store ID match
        if (!order.getStore().getId().equals(storeId)) {
            throw new RuntimeException("Unauthorized access to this order.");
        }

        return order;
    }


     public Order updateOrderStatus(Long orderId, String newStatus) {
        Optional<Order> orderOptional = orderRepo.findById(orderId);
        if (orderOptional.isEmpty()) {
            throw new RuntimeException("Order not found.");
        }

        Order order = orderOptional.get();
        order.setStatus(newStatus);
        Order savedOrder = orderRepo.save(order);

        // Send email to customer
        Customer customer = order.getCustomer();
        if (customer != null && customer.getEmail() != null) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(customer.getEmail());
            message.setSubject("Order Status Updated");
            message.setText("Dear " + customer.getName() + ",\n\nYour order (ID: " + order.getId() + ") status has been updated to: " + newStatus + ".\n\nThank you for shopping with us!");
            mailSender.send(message);
        }

        return savedOrder;
    }

    //----------------------------------------Cancel Order------------------------------------

    @Transactional
    public void cancelOrder(Long orderId) {
        try{
            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (Objects.equals(order.getStatus(), "Shipped") || Objects.equals(order.getStatus(), "Delivered") || Objects.equals(order.getStatus(), "Cancelled")) {
                throw new RuntimeException("Cannot cancel order after it has been shipped or delivered or already cancelled.");
            }

            PaymentLog paymentLog = order.getPaymentLog();
            if (paymentLog != null && !Objects.equals(paymentLog.getMethod(), "Cash on Delivery")) {
//                processRefund(paymentLog);
            }

            // 2. Restore stock
            List<OrderProduct> orderProducts = orderProductRepo.findByOrderId(orderId);
            for (OrderProduct orderProduct : orderProducts) {
                ProductVariants variant = productVariantsRepo.findBySku(orderProduct.getSku());
                if (variant != null) {
                    variant.setStock(variant.getStock() + orderProduct.getQuantity());
                    productVariantsRepo.save(variant);
                }
            }

            // 3. Cancel related shipping
            Shipping shipping = order.getShipping();
            if (shipping != null) {
                shipping.setStatus("Cancelled");
                shippingRepo.save(shipping);
            }

            // 4. Cancel order
            order.setStatus("Cancelled");
            orderRepo.save(order);

        }catch (Exception e) {
            throw new RuntimeException("Failed to cancel order: " + e.getMessage(), e);
        }

    }

    public Long getCustomerIdOfOrder(Long orderId) {
        Optional<Order> optionalOrder = orderRepo.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found.");
        }
        Order order = optionalOrder.get();
        return order.getCustomer().getId();
    }

    // -------------------------------------Create Order-------------------------------------------

    public void createOrder(Long customerId, Long addressId, Long storeId, Map<String, Object> paymentDetails) {
        try {
            // 1. Get Customer Data
            Customer customer = new Customer();
            customer.setId(customerId);

            // 2. Get Store Data
            Store store = new Store();
            store.setId(storeId);

            // 3. Create Empty Order
            Order order = new Order();
            order.setStatus("Pending");
            order.setIssueDate(LocalDateTime.now());
            order.setStore(store);
            order.setCustomer(customer);

            orderRepo.save(order);

            // 4. Get Cart
            ShoppingCart cart = cartService.getCartByCustomerId(customerId);
            if (cart.getCartProducts().isEmpty()) {
                throw new RuntimeException("Cart is empty.");
            }

            // 5. Create Order Products and store variants for later reuse
            List<OrderProduct> orderProducts = new ArrayList<>();
            Map<String, ProductVariants> variantMap = new HashMap<>();
            for(CartProduct cartProduct : cart.getCartProducts()) {
                OrderProduct orderProduct = new OrderProduct();
                orderProduct.setOrder(order);
                orderProduct.setProduct(cartProduct.getProduct());
                orderProduct.setSku(cartProduct.getSku());

                // Quantity Validations
                ProductVariants variant = productVariantsRepo.findAll().stream().filter(v -> v.getSku().equals(cartProduct.getSku())).findFirst().orElseThrow(() -> new RuntimeException("Product variant not found."));;
                if (variant.getStock() < cartProduct.getQuantity()) {
                    throw new RuntimeException("Product stock is low.");
                }

                // Store variant for later reuse in stock deduction
                variantMap.put(cartProduct.getSku(), variant);

                orderProduct.setQuantity(cartProduct.getQuantity());
                orderProduct.setPrice(variant.getPrice().doubleValue());
                orderProducts.add(orderProduct);
            }
            orderProductRepo.saveAll(orderProducts);

            // 6. Create Shipping Data
            Address address = addressRepo.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            ShippingInfo shippingInfo = shippingInfoRepo.findByStoreIdAndGovernmentName(storeId, address.getCity());
            if (shippingInfo == null) {
                throw new RuntimeException("Shipping info to this city not found.");
            }
            Shipping shipping = new Shipping();
            shipping.setAddress(address);
            shipping.setCost(shippingInfo.getShippingPrice().doubleValue());
            shipping.setStatus("Pending");
            shipping.setShippingDate(null);
            shippingRepo.save(shipping);

            // 7. Process Payment and Create PaymentLog
            PaymentLog paymentLog = null;
            if (paymentDetails != null) {
                String paymentMethod = (String) paymentDetails.get("paymentMethod");
                Double amount = paymentDetails.get("amount") != null ? Double.valueOf(paymentDetails.get("amount").toString()) : null;
                String transactionId = (String) paymentDetails.get("transactionId");
                String status = (String) paymentDetails.get("status");

                if (paymentMethod != null && amount != null) {
                    paymentLog = new PaymentLog();
                    paymentLog.setAmount(amount);
                    paymentLog.setTimestamp(LocalDateTime.now());
                    paymentLog.setStatus(status != null ? status : "success");
                    paymentLog.setMethod(getPaymentMethodString(paymentMethod));
                    paymentLog.setStore(store);
                    paymentLogRepo.save(paymentLog);
                }
            }

            // 8. Add Order Data
            order.setPrice(cart.getTotalPrice().doubleValue());
            order.setPaymentLog(paymentLog);
            order.setShipping(shipping);
            order.setOrderProducts(orderProducts);

            // 9. Save Order and Clear Shopping cart
            orderRepo.save(order);
            
            // 10. Deduct stock from variants after successful order creation (reuse variants from step 5)
            for(CartProduct cartProduct : cart.getCartProducts()) {
                ProductVariants variant = variantMap.get(cartProduct.getSku());
                if (variant != null) {
                    variant.setStock(variant.getStock() - cartProduct.getQuantity());
                    productVariantsRepo.save(variant);
                }
            }
            
            // 11. Check for low stock notifications after stock update
            for(CartProduct cartProduct : cart.getCartProducts()) {
                lowStockNotificationService.checkAndSendLowStockNotification(cartProduct.getProduct());
            }
            
            cartService.clearCart(customerId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    // Overloaded method for backward compatibility
    public void createOrder(Long customerId, Long addressId, Long storeId) {
        createOrder(customerId, addressId, storeId, null);
    }

    private String getPaymentMethodString(String paymentMethod) {
        if ("card".equals(paymentMethod)) return "Credit Card";
        if ("valu".equals(paymentMethod)) return "Valu";
        if ("ewallet".equals(paymentMethod)) return "E-Wallet";
        if("cod".equals(paymentMethod)) return "Cash On Delivery";
        return "Unknown";
    }

    public List<Order> getOrdersByStoreAndDateRange(Long storeId, java.time.LocalDate start, java.time.LocalDate end) {
        List<Order> allOrders = getAllOrders(storeId);
        return allOrders.stream()
                .filter(order -> order.getIssueDate() != null &&
                        !order.getIssueDate().toLocalDate().isBefore(start) &&
                        !order.getIssueDate().toLocalDate().isAfter(end))
                .collect(java.util.stream.Collectors.toList());
    }

    // Excel Export Method
    public byte[] exportOrdersToExcel(Long storeId) throws IOException {
        Store existingStore = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        List<Order> orders = getAllOrders(storeId);
        List<OrderExportDTO> exportData = new ArrayList<>();

        for (Order order : orders) {
            // Get customer information
            String customerName = "";
            String customerEmail = "";
            if (order.getCustomer() != null) {
                customerName = order.getCustomer().getName() != null ? order.getCustomer().getName() : "";
                customerEmail = order.getCustomer().getEmail() != null ? order.getCustomer().getEmail() : "";
            }

            // Calculate total amount and item count
            BigDecimal totalAmount = BigDecimal.ZERO;
            Integer itemCount = 0;
            
            if (order.getOrderProducts() != null && !order.getOrderProducts().isEmpty()) {
                totalAmount = order.getOrderProducts().stream()
                        .map(op -> BigDecimal.valueOf(op.getPrice() * op.getQuantity()))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                itemCount = order.getOrderProducts().stream()
                        .mapToInt(OrderProduct::getQuantity)
                        .sum();
            }

            exportData.add(new OrderExportDTO(
                order.getId(),
                customerName,
                customerEmail,
                order.getStatus() != null ? order.getStatus() : "",
                totalAmount,
                itemCount,
                order.getIssueDate()
            ));
        }

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Orders");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = createHeaderStyle(workbook);
            
            String[] headers = {"Order ID", "Customer Name", "Customer Email", "Status", "Total Amount", "Item Count", "Issue Date"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Create data rows
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            
            for (int i = 0; i < exportData.size(); i++) {
                Row row = sheet.createRow(i + 1);
                OrderExportDTO order = exportData.get(i);
                
                row.createCell(0).setCellValue(order.getOrderId());
                row.createCell(1).setCellValue(order.getCustomerName());
                row.createCell(2).setCellValue(order.getCustomerEmail());
                row.createCell(3).setCellValue(order.getStatus());
                
                Cell amountCell = row.createCell(4);
                amountCell.setCellValue(order.getTotalAmount().doubleValue());
                amountCell.setCellStyle(currencyStyle);
                
                row.createCell(5).setCellValue(order.getItemCount());
                
                Cell dateCell = row.createCell(6);
                if (order.getIssueDate() != null) {
                    dateCell.setCellValue(order.getIssueDate());
                    dateCell.setCellStyle(dateStyle);
                }
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }

    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setDataFormat(workbook.createDataFormat().getFormat("yyyy-mm-dd hh:mm:ss"));
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setDataFormat(workbook.createDataFormat().getFormat("$#,##0.00"));
        return style;
    }
}