package com.pahana.edu.billing.api;

import com.pahana.edu.billing.domain.dto.customer.*;
import com.pahana.edu.billing.service.interfaces.CustomerService;
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

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomerService customerService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void create_ShouldReturnCreatedCustomer() throws Exception {
        CustomerCreateRequest request = new CustomerCreateRequest("John Doe", "john@example.com", "1234567890", "123 Main St", null, null);
        CustomerResponse response = new CustomerResponse(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", null, null);
        
        when(customerService.create(any(CustomerCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("John Doe"));

        verify(customerService).create(any(CustomerCreateRequest.class));
    }

    @Test
    void get_ShouldReturnCustomer() throws Exception {
        CustomerResponse response = new CustomerResponse(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", null, null);
        
        when(customerService.get(1L)).thenReturn(response);

        mockMvc.perform(get("/api/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("John Doe"));

        verify(customerService).get(1L);
    }

    @Test
    void list_ShouldReturnAllCustomers() throws Exception {
        List<CustomerResponse> customers = Arrays.asList(
            new CustomerResponse(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", null, null),
            new CustomerResponse(2L, "Jane Smith", "jane@example.com", "0987654321", "456 Oak Ave", null, null)
        );
        
        when(customerService.list()).thenReturn(customers);

        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(customerService).list();
    }

    @Test
    void update_ShouldReturnUpdatedCustomer() throws Exception {
        CustomerCreateRequest request = new CustomerCreateRequest("John Updated", "john.updated@example.com", "1111111111", "789 New St", null, null);
        CustomerResponse response = new CustomerResponse(1L, "John Updated", "john.updated@example.com", "1111111111", "789 New St", null, null);
        
        when(customerService.update(eq(1L), any(CustomerCreateRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/customers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Updated"));

        verify(customerService).update(eq(1L), any(CustomerCreateRequest.class));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        doNothing().when(customerService).delete(1L);

        mockMvc.perform(delete("/api/customers/1"))
                .andExpect(status().isNoContent());

        verify(customerService).delete(1L);
    }
}