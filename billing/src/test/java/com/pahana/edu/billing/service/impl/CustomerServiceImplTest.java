
package com.pahana.edu.billing.service.impl;

import com.pahana.edu.billing.domain.dto.customer.CustomerCreateRequest;
import com.pahana.edu.billing.domain.dto.customer.CustomerResponse;
import com.pahana.edu.billing.domain.entity.Customer;
import com.pahana.edu.billing.exception.NotFoundException;
import com.pahana.edu.billing.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

  @Mock
  CustomerRepository repo;

  @InjectMocks
  CustomerServiceImpl service;

  @Test
  void create_shouldMapAndSave_andReturnResponse() {
    // Arrange
    var req = new CustomerCreateRequest(
        "ACC-1001",
        "Alice",
        "221B Baker Street",
        "0711234567",
        LocalDate.of(2023, 1, 10),
        null // status (nullable here to avoid enum coupling)
    );
    // Act
    CustomerResponse res = service.create(req);

    // Assert
    ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);
    verify(repo).save(captor.capture());
    Customer saved = captor.getValue();
    assertEquals(req.accountNumber(), saved.getAccountNumber());
    assertEquals(req.customerName(), saved.getCustomerName());
    assertEquals(req.address(), saved.getAddress());
    assertEquals(req.telephoneNumber(), saved.getTelephoneNumber());
    assertEquals(req.registrationDate(), saved.getRegistrationDate());
    assertEquals(req.status(), saved.getStatus());

    assertNotNull(res);
    assertNull(res.customerId());
    assertEquals(req.accountNumber(), res.accountNumber());
    assertEquals(req.customerName(), res.customerName());
    assertEquals(req.address(), res.address());
    assertEquals(req.telephoneNumber(), res.telephoneNumber());
    assertEquals(req.registrationDate(), res.registrationDate());
    assertEquals(req.status(), res.status());
  }

  @Test
  void get_whenFound_shouldReturnMappedResponse() {
    // Arrange
    Customer c = existingCustomer(
        10L,
        "ACC-2002",
        "Bob",
        "742 Evergreen Terrace",
        "0729876543",
        LocalDate.of(2022, 5, 5),
        null
    );
    when(repo.findById(10L)).thenReturn(Optional.of(c));

    // Act
    CustomerResponse res = service.get(10L);

    // Assert
    assertEquals(c.getCustomerId(), res.customerId());
    assertEquals(c.getAccountNumber(), res.accountNumber());
    assertEquals(c.getCustomerName(), res.customerName());
    assertEquals(c.getAddress(), res.address());
    assertEquals(c.getTelephoneNumber(), res.telephoneNumber());
    assertEquals(c.getRegistrationDate(), res.registrationDate());
    assertEquals(c.getStatus(), res.status());
  }

  @Test
  void get_whenMissing_shouldThrowNotFound() {
    when(repo.findById(999L)).thenReturn(Optional.empty());
    assertThrows(NotFoundException.class, () -> service.get(999L));
  }

  @Test
  void list_shouldReturnAllMapped() {
    // Arrange
    Customer c1 = existingCustomer(1L, "A1", "John", "Addr1", "0700000001", LocalDate.of(2020,1,1), null);
    Customer c2 = existingCustomer(2L, "A2", "Jane", "Addr2", "0700000002", LocalDate.of(2021,2,2), null);
    when(repo.findAll()).thenReturn(List.of(c1, c2));

    // Act
    List<CustomerResponse> out = service.list();

    // Assert
    assertEquals(2, out.size());
    assertEquals(c1.getCustomerId(), out.get(0).customerId());
    assertEquals(c2.getCustomerId(), out.get(1).customerId());
  }

  @Test
  void update_whenFound_shouldApplyChanges_andReturnResponse() {
    // Arrange
    Customer existing = existingCustomer(
        5L,
        "OLD",
        "Old Name",
        "Old Address",
        "0791111111",
        LocalDate.of(2019, 9, 9),
        null
    );
    when(repo.findById(5L)).thenReturn(Optional.of(existing));
    var req = new CustomerCreateRequest(
        "NEW-5005",
        "New Name",
        "New Address",
        "0792222222",
        LocalDate.of(2024, 3, 3),
        null
    );

    // Act
    CustomerResponse res = service.update(5L, req);

    // Assert
    verify(repo).save(existing);
    assertEquals(req.accountNumber(), existing.getAccountNumber());
    assertEquals(req.customerName(), existing.getCustomerName());
    assertEquals(req.address(), existing.getAddress());
    assertEquals(req.telephoneNumber(), existing.getTelephoneNumber());
    assertEquals(req.registrationDate(), existing.getRegistrationDate());
    assertEquals(req.status(), existing.getStatus());

    assertEquals(existing.getCustomerId(), res.customerId());
    assertEquals(req.accountNumber(), res.accountNumber());
    assertEquals(req.customerName(), res.customerName());
    assertEquals(req.address(), res.address());
    assertEquals(req.telephoneNumber(), res.telephoneNumber());
    assertEquals(req.registrationDate(), res.registrationDate());
    assertEquals(req.status(), res.status());
  }

  @Test
  void update_whenMissing_shouldThrowNotFound() {
    when(repo.findById(123L)).thenReturn(Optional.empty());
    var req = new CustomerCreateRequest("ACC", "Name", "Addr", "0701231231", LocalDate.now(), null);
    assertThrows(NotFoundException.class, () -> service.update(123L, req));
  }

  @Test
  void delete_shouldDelegateToRepository() {
    // Act
    service.delete(77L);
    // Assert
    verify(repo).deleteById(77L);
  }

  // Helpers
  private static Customer existingCustomer(Long id, String acc, String name, String addr, String tel, LocalDate reg, Object status) {
    Customer c = new Customer();
    c.setCustomerId(id);
    c.setAccountNumber(acc);
    c.setCustomerName(name);
    c.setAddress(addr);
    c.setTelephoneNumber(tel);
    c.setRegistrationDate(reg);
    // status type is unknown here; set via reflection-safe cast if available, otherwise null
    // If getStatus()/setStatus() accept an enum, passing null is safe for these tests
    c.setStatus(null);
    return c;
  }
}