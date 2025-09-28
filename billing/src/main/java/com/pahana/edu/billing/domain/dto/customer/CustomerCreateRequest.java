
package com.pahana.edu.billing.domain.dto.customer;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CustomerCreateRequest(
    @NotBlank String accountNumber,
    @NotBlank String customerName,
    String address,
    String telephoneNumber,
    LocalDate registrationDate,
    String status
) {}