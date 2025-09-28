// service/interfaces/BillingService.java
package com.pahana.edu.billing.service.interfaces;
import com.pahana.edu.billing.domain.dto.bill.*;
import java.util.List;

public interface BillingService {
  BillResponse create(BillCreateRequest req);
  BillResponse get(Long id);
  List<BillResponse> listByCustomer(Long customerId);
  BillResponse markPaid(Long billId);
  List<BillResponse> listAll(); // Add this method
}
