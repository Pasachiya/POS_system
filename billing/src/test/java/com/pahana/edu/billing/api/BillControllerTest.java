package com.pahana.edu.billing.api;

import com.pahana.edu.billing.domain.dto.bill.*;
import com.pahana.edu.billing.service.interfaces.BillingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.pahana.edu.billing.domain.enums.PaymentStatus;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BillController.class)
class BillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BillingService billingService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void create_ShouldReturnCreatedBill() throws Exception {
        BillCreateRequest request = new BillCreateRequest(1L, "BILL-001", LocalDate.now(), Collections.emptyList());
        BillResponse response = new BillResponse(1L, "BILL-001", 1L, "John Doe", LocalDate.now(), 10.0, 100.0, PaymentStatus.PENDING, Collections.emptyList());
        
        when(billingService.create(any(BillCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/bills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.billId").value(1L))
                .andExpect(jsonPath("$.paymentStatus").value("PENDING"));

        verify(billingService).create(any(BillCreateRequest.class));
    }

    @Test
    void get_ShouldReturnBill() throws Exception {
        BillResponse response = new BillResponse(1L, "BILL-001", 1L, "John Doe", LocalDate.now(), 10.0, 100.0, PaymentStatus.PENDING, Collections.emptyList());
        
        when(billingService.get(1L)).thenReturn(response);

        mockMvc.perform(get("/api/bills/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.billId").value(1L));

        verify(billingService).get(1L);
    }

    @Test
    void listByCustomer_ShouldReturnCustomerBills() throws Exception {
        List<BillResponse> bills = Arrays.asList(
            new BillResponse(1L, "BILL-001", 1L, "John Doe", LocalDate.now(), 10.0, 100.0, PaymentStatus.PENDING, Collections.emptyList()),
            new BillResponse(2L, "BILL-002", 1L, "John Doe", LocalDate.now(), 20.0, 200.0, PaymentStatus.PAID, Collections.emptyList())
        );
        
        when(billingService.listByCustomer(1L)).thenReturn(bills);

        mockMvc.perform(get("/api/bills").param("customerId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(billingService).listByCustomer(1L);
    }

    @Test
    void markPaid_ShouldReturnPaidBill() throws Exception {
        BillResponse response = new BillResponse(1L, "BILL-001", 1L, "John Doe", LocalDate.now(), 10.0, 100.0, PaymentStatus.PAID, Collections.emptyList());
        
        when(billingService.markPaid(1L)).thenReturn(response);

        mockMvc.perform(post("/api/bills/1/pay"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.billId").value(1L))
                .andExpect(jsonPath("$.paymentStatus").value("PAID"));

        verify(billingService).markPaid(1L);
    }
}