package com.pahana.edu.billing.service.impl;

import com.pahana.edu.billing.domain.dto.bill.BillCreateRequest;
import com.pahana.edu.billing.domain.dto.bill.BillItemRequest;
import com.pahana.edu.billing.domain.dto.bill.BillResponse;
import com.pahana.edu.billing.domain.entity.Bill;
import com.pahana.edu.billing.domain.entity.BillItem;
import com.pahana.edu.billing.domain.entity.Customer;
import com.pahana.edu.billing.domain.entity.Item;
import com.pahana.edu.billing.domain.enums.PaymentStatus;
import com.pahana.edu.billing.exception.NotFoundException;
import com.pahana.edu.billing.repository.BillRepository;
import com.pahana.edu.billing.repository.CustomerRepository;
import com.pahana.edu.billing.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BillingServiceImplTest {

  @Mock private BillRepository billRepo;
  @Mock private CustomerRepository customerRepo;
  @Mock private ItemRepository itemRepo;

  private BillingServiceImpl service;

  @BeforeEach
  void setUp() {
    service = new BillingServiceImpl(billRepo, customerRepo, itemRepo);
    ReflectionTestUtils.setField(service, "taxPercent", 10.0); // 10% tax for tests
  }

  @Test
  void create_shouldComputeTotalsAndReduceStock() {
    // Arrange
    when(billRepo.existsByBillNumber("B001")).thenReturn(false);

    var customer = new Customer();
    customer.setCustomerId(1L);
    customer.setCustomerName("Alice");
    when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));

    var item1 = new Item();
    item1.setItemId(1001L);
    item1.setItemName("Pen");
    item1.setPrice(50.0);
    item1.setStockQuantity(10);

    var item2 = new Item();
    item2.setItemId(1002L);
    item2.setItemName("Book");
    item2.setPrice(30.0);
    item2.setStockQuantity(5);

    when(itemRepo.findById(1001L)).thenReturn(Optional.of(item1));
    when(itemRepo.findById(1002L)).thenReturn(Optional.of(item2));

    doAnswer(inv -> inv.getArgument(0)).when(itemRepo).save(any(Item.class));
    doAnswer(inv -> inv.getArgument(0)).when(billRepo).save(any(Bill.class));

    var itemsReq = List.of(
        new BillItemRequest(1001L, 2, null),       // uses default item price 50 * 2
        new BillItemRequest(1002L, 1, 120.0)       // override price 120 * 1
    );
    var req = new BillCreateRequest(1L, "B001", LocalDate.of(2025, 1, 1), itemsReq);

    // Act
    BillResponse res = service.create(req);

    // Assert
    double net = 50.0 * 2 + 120.0 * 1; // 220
    double tax = net * 0.10;           // 22
    assertNotNull(res);
    assertEquals("B001", res.billNumber());
    assertEquals(1L, res.customerId());
    assertEquals(PaymentStatus.PENDING, res.paymentStatus());
    assertEquals(2, res.items().size());
    assertEquals(tax, res.taxAmount(), 1e-6);
    assertEquals(net + tax, res.totalAmount(), 1e-6);

    // Stock reduced
    assertEquals(8, item1.getStockQuantity());
    assertEquals(4, item2.getStockQuantity());
    verify(itemRepo, times(2)).save(any(Item.class));
    verify(billRepo, times(1)).save(any(Bill.class));
  }

  @Test
  void create_shouldThrowForDuplicateBillNumber() {
    when(billRepo.existsByBillNumber("B001")).thenReturn(true);
    var req = new BillCreateRequest(1L, "B001", LocalDate.now(), List.of());
    assertThrows(IllegalArgumentException.class, () -> service.create(req));
    verifyNoInteractions(customerRepo, itemRepo);
  }

  @Test
  void create_shouldThrowWhenCustomerNotFound() {
    when(billRepo.existsByBillNumber("B001")).thenReturn(false);
    when(customerRepo.findById(1L)).thenReturn(Optional.empty());
    var req = new BillCreateRequest(1L, "B001", LocalDate.now(), List.of());
    assertThrows(NotFoundException.class, () -> service.create(req));
  }

  @Test
  void create_shouldThrowWhenItemNotFound() {
    when(billRepo.existsByBillNumber("B001")).thenReturn(false);

    var customer = new Customer();
    customer.setCustomerId(1L);
    customer.setCustomerName("Alice");
    when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));

    when(itemRepo.findById(1001L)).thenReturn(Optional.empty());

    var req = new BillCreateRequest(1L, "B001", LocalDate.now(),
        List.of(new BillItemRequest(1001L, 1, null)));

    NotFoundException ex = assertThrows(NotFoundException.class, () -> service.create(req));
    assertTrue(ex.getMessage().contains("Item not found"));
  }

  @Test
  void create_shouldThrowWhenInsufficientStock() {
    when(billRepo.existsByBillNumber("B001")).thenReturn(false);

    var customer = new Customer();
    customer.setCustomerId(1L);
    when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));

    var item = new Item();
    item.setItemId(1001L);
    item.setItemName("Pen");
    item.setPrice(50.0);
    item.setStockQuantity(1);

    when(itemRepo.findById(1001L)).thenReturn(Optional.of(item));

    var req = new BillCreateRequest(1L, "B001", LocalDate.now(),
        List.of(new BillItemRequest(1001L, 2, null)));

    IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.create(req));
    assertTrue(ex.getMessage().contains("Insufficient stock"));
  }

  @Test
  void get_shouldReturnBillResponse() {
    var customer = new Customer();
    customer.setCustomerId(5L);
    customer.setCustomerName("Bob");

    var bill = Bill.builder()
        .billId(10L)
        .billNumber("B010")
        .customer(customer)
        .billDate(LocalDate.of(2025, 1, 2))
        .paymentStatus(PaymentStatus.PENDING)
        .taxAmount(5.0)
        .totalAmount(55.0)
        .build();

    // ensure items list exists and can be empty
    if (bill.getItems() == null) {
      // safety in case entity doesn't initialize the collection
      ReflectionTestUtils.setField(bill, "items", new ArrayList<BillItem>());
    }

    when(billRepo.findById(10L)).thenReturn(Optional.of(bill));

    var res = service.get(10L);

    assertEquals(10L, res.billId());
    assertEquals("B010", res.billNumber());
    assertEquals(5L, res.customerId());
    assertEquals("Bob", res.customerName());
    assertEquals(0, res.items().size());
  }

  @Test
  void listByCustomer_shouldMapAll() {
    var customer = new Customer();
    customer.setCustomerId(9L);
    customer.setCustomerName("Carol");

    var b1 = Bill.builder()
        .billId(1L).billNumber("B001").customer(customer)
        .billDate(LocalDate.now()).paymentStatus(PaymentStatus.PENDING)
        .taxAmount(0.0).totalAmount(0.0).build();
    var b2 = Bill.builder()
        .billId(2L).billNumber("B002").customer(customer)
        .billDate(LocalDate.now()).paymentStatus(PaymentStatus.PAID)
        .taxAmount(0.0).totalAmount(0.0).build();

    when(billRepo.findByCustomer_CustomerId(9L)).thenReturn(List.of(b1, b2));

    var list = service.listByCustomer(9L);
    assertEquals(2, list.size());
    assertEquals("B001", list.get(0).billNumber());
    assertEquals("B002", list.get(1).billNumber());
  }

  @Test
  void markPaid_shouldUpdateStatus() {
    var customer = new Customer();
    customer.setCustomerId(7L);

    var bill = Bill.builder()
        .billId(33L)
        .billNumber("B033")
        .customer(customer)
        .billDate(LocalDate.now())
        .paymentStatus(PaymentStatus.PENDING)
        .taxAmount(0.0).totalAmount(0.0)
        .build();

    when(billRepo.findById(33L)).thenReturn(Optional.of(bill));
    doAnswer(inv -> inv.getArgument(0)).when(billRepo).save(any(Bill.class));

    var res = service.markPaid(33L);

    assertEquals(PaymentStatus.PAID, res.paymentStatus());
    assertEquals(PaymentStatus.PAID, bill.getPaymentStatus());

    ArgumentCaptor<Bill> captor = ArgumentCaptor.forClass(Bill.class);
    verify(billRepo).save(captor.capture());
    assertEquals(PaymentStatus.PAID, captor.getValue().getPaymentStatus());
  }
}