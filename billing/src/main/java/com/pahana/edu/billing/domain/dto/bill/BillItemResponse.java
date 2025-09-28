
package com.pahana.edu.billing.domain.dto.bill;

public record BillItemResponse(Long billItemId, Long itemId, String itemName,
                               Integer quantity, Double unitPrice, Double subtotal) {}