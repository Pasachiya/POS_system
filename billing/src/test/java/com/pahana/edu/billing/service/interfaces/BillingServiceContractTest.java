
package com.pahana.edu.billing.service.interfaces;

import com.pahana.edu.billing.repository.BillRepository;
import com.pahana.edu.billing.repository.CustomerRepository;
import com.pahana.edu.billing.repository.ItemRepository;
import com.pahana.edu.billing.service.impl.BillingServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertTrue;

class BillingServiceContractTest {

  @Test
  void impl_shouldImplementInterface() {
    assertTrue(BillingService.class.isAssignableFrom(BillingServiceImpl.class));
  }

  @Test
  void impl_isUsableViaInterface() {
    BillRepository billRepo = Mockito.mock(BillRepository.class);
    CustomerRepository customerRepo = Mockito.mock(CustomerRepository.class);
    ItemRepository itemRepo = Mockito.mock(ItemRepository.class);

    BillingService service = new BillingServiceImpl(billRepo, customerRepo, itemRepo);
    // ... no further action; compilation and type assignability is the contract check.
  }
}