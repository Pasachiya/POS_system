
package com.pahana.edu.billing.domain.dto.bill;
import jakarta.validation.constraints.*;

public record BillItemRequest(@NotNull Long itemId, @NotNull Integer quantity, Double unitPrice) {}