package com.pahana.edu.billing.domain.dto.bill;
import com.pahana.edu.billing.domain.enums.PaymentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BillResponse(Long billId, String billNumber, Long customerId, String customerName,
                           LocalDate billDate, Double taxAmount, Double totalAmount,
                           PaymentStatus paymentStatus, List<BillItemResponse> items) {
}