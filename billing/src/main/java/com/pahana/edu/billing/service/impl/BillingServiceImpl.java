// service/impl/BillingServiceImpl.java
package com.pahana.edu.billing.service.impl;

import com.pahana.edu.billing.domain.dto.bill.*;
import com.pahana.edu.billing.domain.entity.*;
import com.pahana.edu.billing.domain.enums.PaymentStatus;
import com.pahana.edu.billing.exception.NotFoundException;
import com.pahana.edu.billing.repository.*;
import com.pahana.edu.billing.service.interfaces.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service @RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {
  private final BillRepository billRepo;
  private final CustomerRepository customerRepo;
  private final ItemRepository itemRepo;

  @Value("${app.billing.tax-percent:0}")
  private double taxPercent;

  @Override @Transactional
  public BillResponse create(BillCreateRequest r){
    if(billRepo.existsByBillNumber(r.billNumber()))
      throw new IllegalArgumentException("Duplicate billNumber");

    var customer = customerRepo.findById(r.customerId())
        .orElseThrow(() -> new NotFoundException("Customer not found"));

    var bill = Bill.builder()
      .billNumber(r.billNumber())
      .customer(customer)
      .billDate(r.billDate()!=null? r.billDate(): LocalDate.now())
      .paymentStatus(PaymentStatus.PENDING)
      .taxAmount(0.0).totalAmount(0.0).build();

    if (bill.getItems() == null) bill.setItems(new java.util.ArrayList<>());

    double net = 0.0;
    for(var itReq : r.items()){
      var item = itemRepo.findById(itReq.itemId())
          .orElseThrow(() -> new NotFoundException("Item not found: "+itReq.itemId()));
      double unitPrice = (itReq.unitPrice()!=null? itReq.unitPrice(): item.getPrice());
      int qty = itReq.quantity();
      double subtotal = unitPrice * qty;
      net += subtotal;

      // reduce stock
      if(item.getStockQuantity() < qty) throw new IllegalArgumentException("Insufficient stock for "+item.getItemName());
      item.setStockQuantity(item.getStockQuantity()-qty);
      itemRepo.save(item);

      var bi = BillItem.builder().bill(bill).item(item).quantity(qty)
                       .unitPrice(unitPrice).subtotal(subtotal).build();
      bill.getItems().add(bi);
    }

    double tax = (taxPercent/100.0)*net;
    bill.setTaxAmount(tax);
    bill.setTotalAmount(net + tax);

    billRepo.save(bill);
    return toDto(bill);
  }

  @Override 
  public BillResponse get(Long id){
    var b = billRepo.findById(id).orElseThrow(() -> new NotFoundException("Bill not found"));
    return toDto(b);
  }

  @Override 
  public List<BillResponse> listByCustomer(Long customerId){
    return billRepo.findByCustomer_CustomerId(customerId).stream().map(this::toDto).toList();
  }

  // Add this method - GET ALL BILLS
  @Override
  public List<BillResponse> listAll() {
    return billRepo.findAll().stream().map(this::toDto).toList();
  }

  @Override @Transactional
  public BillResponse markPaid(Long billId){
    var b = billRepo.findById(billId).orElseThrow(() -> new NotFoundException("Bill not found"));
    b.setPaymentStatus(PaymentStatus.PAID);
    billRepo.save(b);
    return toDto(b);
  }

  private BillResponse toDto(Bill b){
    var items = b.getItems().stream()
      .map(i -> new BillItemResponse(i.getBillItemId(), i.getItem().getItemId(), i.getItem().getItemName(),
                                     i.getQuantity(), i.getUnitPrice(), i.getSubtotal()))
      .toList();
    return new BillResponse(b.getBillId(), b.getBillNumber(), b.getCustomer().getCustomerId(),
      b.getCustomer().getCustomerName(), b.getBillDate(), b.getTaxAmount(), b.getTotalAmount(),
      b.getPaymentStatus(), items);
  }
}
