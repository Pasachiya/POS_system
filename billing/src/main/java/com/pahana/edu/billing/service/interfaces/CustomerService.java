// service/interfaces/CustomerService.java
package com.pahana.edu.billing.service.interfaces;
import com.pahana.edu.billing.domain.dto.customer.*;
import java.util.List;
public interface CustomerService {
  CustomerResponse create(CustomerCreateRequest req);
  CustomerResponse get(Long id);
  List<CustomerResponse> list();
  CustomerResponse update(Long id, CustomerCreateRequest req);
  void delete(Long id);
}
