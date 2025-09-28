
package com.pahana.edu.billing.domain.dto.item;

public record ItemUpdateRequest(String itemName, String category, Double price, Integer stockQuantity) {}