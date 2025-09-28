package com.pahana.edu.billing.api;

import com.pahana.edu.billing.domain.dto.item.*;
import com.pahana.edu.billing.service.interfaces.ItemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ItemController.class)
class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ItemService itemService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void create_ShouldReturnCreatedItem() throws Exception {
        ItemCreateRequest request = new ItemCreateRequest("Test Item", "Description", 10.0, 100);
        ItemResponse response = new ItemResponse(1L, "Test Item", "Description", 10.0, 100);
        
        when(itemService.create(any(ItemCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Test Item"));

        verify(itemService).create(any(ItemCreateRequest.class));
    }

    @Test
    void get_ShouldReturnItem() throws Exception {
        ItemResponse response = new ItemResponse(1L, "Test Item", "Description", 10.0, 100);
        
        when(itemService.get(1L)).thenReturn(response);

        mockMvc.perform(get("/api/items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));

        verify(itemService).get(1L);
    }

    @Test
    void list_ShouldReturnAllItems() throws Exception {
        List<ItemResponse> items = Arrays.asList(
            new ItemResponse(1L, "Item1", "Desc1", 10.0, 100),
            new ItemResponse(2L, "Item2", "Desc2", 20.0, 200)
        );
        
        when(itemService.list()).thenReturn(items);

        mockMvc.perform(get("/api/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(itemService).list();
    }

    @Test
    void update_ShouldReturnUpdatedItem() throws Exception {
        ItemUpdateRequest request = new ItemUpdateRequest("Updated Item", "Updated Description", 15.0, 150);
        ItemResponse response = new ItemResponse(1L, "Updated Item", "Updated Description", 15.0, 150);
        
        when(itemService.update(eq(1L), any(ItemUpdateRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/items/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Item"));

        verify(itemService).update(eq(1L), any(ItemUpdateRequest.class));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        doNothing().when(itemService).delete(1L);

        mockMvc.perform(delete("/api/items/1"))
                .andExpect(status().isNoContent());

        verify(itemService).delete(1L);
    }
}