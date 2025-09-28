
package com.pahana.edu.billing.service.interfaces;

import com.pahana.edu.billing.exception.NotFoundException;
import com.pahana.edu.billing.repository.CustomerRepository;
import com.pahana.edu.billing.service.impl.CustomerServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceInterfaceSmokeTest {

  @Mock
  CustomerRepository repo;

  @Test
  void list_viaInterface_shouldWork() {
    when(repo.findAll()).thenReturn(Collections.emptyList());
    CustomerService svc = new CustomerServiceImpl(repo);

    assertTrue(svc.list().isEmpty());
    verify(repo).findAll();
  }

  @Test
  void get_viaInterface_missing_shouldThrowNotFound() {
    when(repo.findById(1L)).thenReturn(Optional.empty());
    CustomerService svc = new CustomerServiceImpl(repo);

    assertThrows(NotFoundException.class, () -> svc.get(1L));
  }

  @Test
  void delete_viaInterface_shouldDelegate() {
    CustomerService svc = new CustomerServiceImpl(repo);

    svc.delete(9L);
    verify(repo).deleteById(9L);
  }
}