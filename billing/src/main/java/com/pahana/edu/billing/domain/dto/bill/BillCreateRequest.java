package com.pahana.edu.billing.domain.dto.bill;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public record BillCreateRequest(@NotNull Long customerId, @NotBlank String billNumber,
                                LocalDate billDate, @NotNull List<BillItemRequest> items) {
}