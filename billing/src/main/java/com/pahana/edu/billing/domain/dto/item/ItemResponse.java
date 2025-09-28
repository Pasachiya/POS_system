
package com.pahana.edu.billing.domain.dto.item;

public record ItemResponse(Long itemId, String itemName, String category, Double price, Integer stockQuantity) {}