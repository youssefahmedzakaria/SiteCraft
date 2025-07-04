package com.sitecraft.backend.Controllers;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Services.WishListService;
import com.sitecraft.backend.Models.WishList;
import com.sitecraft.backend.Models.WishListProduct;
import com.sitecraft.backend.DTOs.WishListProductDTO;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WishListController.class)
@AutoConfigureMockMvc(addFilters = false)
public class WishListControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private WishListService wishListService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetWishListSummary_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        WishList wishList = new WishList();
        wishList.setId(1L);
        wishList.setNumberOfProducts(3);
        when(wishListService.getWishListByCustomerId(1L)).thenReturn(wishList);
        mockMvc.perform(get("/api/wishlist").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.numberOfProducts").value(3));
    }

    @Test
    void testGetWishListSummary_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/wishlist"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testGetWishListProducts_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        WishList wishList = new WishList();
        wishList.setId(1L);
        when(wishListService.getWishListByCustomerId(1L)).thenReturn(wishList);
        List<WishListProductDTO> dtos = List.of(new WishListProductDTO());
        when(wishListService.getWishListProductDTOs(1L)).thenReturn(dtos);
        mockMvc.perform(get("/api/wishlist/products").session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testAddProductToWishList_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        WishListProduct wp = new WishListProduct();
        WishListProductDTO dto = new WishListProductDTO();
        when(wishListService.addProductToWishList(eq(1L), anyLong(), anyString())).thenReturn(wp);
        when(wishListService.createWishListProductDTO(wp)).thenReturn(dto);
        String reqJson = "{\"productId\":2,\"sku\":\"sku123\"}";
        mockMvc.perform(post("/api/wishlist/add")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(reqJson))
                .andExpect(status().isOk());
    }

    @Test
    void testRemoveProductFromWishList_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        when(wishListService.removeProductFromWishList(1L, 2L)).thenReturn(true);
        mockMvc.perform(delete("/api/wishlist/remove/2").session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testClearWishList_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        doNothing().when(wishListService).clearWishList(1L);
        mockMvc.perform(delete("/api/wishlist/clear").session(session))
                .andExpect(status().isOk());
    }
} 