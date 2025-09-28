
package com.pahana.edu.billing.domain.dto.item;
import jakarta.validation.constraints.*;

public record ItemCreateRequest(@NotBlank String itemName, String category,
                                @NotNull Double price, @NotNull Integer stockQuantity) {}