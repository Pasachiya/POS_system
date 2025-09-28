
package com.pahana.edu.billing.domain.dto.customer;

import java.time.LocalDate;

public record CustomerResponse(
    Long customerId,
    String accountNumber,
    String customerName,
    String address,
    String telephoneNumber,
    LocalDate registrationDate,
    String status
) {}