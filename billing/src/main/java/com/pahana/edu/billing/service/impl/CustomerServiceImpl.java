// service/impl/CustomerServiceImpl.java
package com.pahana.edu.billing.service.impl;

import com.pahana.edu.billing.domain.dto.customer.*;
import com.pahana.edu.billing.domain.entity.Customer;
import com.pahana.edu.billing.exception.NotFoundException;
import com.pahana.edu.billing.repository.CustomerRepository;
import com.pahana.edu.billing.service.interfaces.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
  private final CustomerRepository repo;

  @Override public CustomerResponse create(CustomerCreateRequest r){
    var c = Customer.builder()
      .accountNumber(r.accountNumber()).customerName(r.customerName())
      .address(r.address()).telephoneNumber(r.telephoneNumber())
      .registrationDate(r.registrationDate()).status(r.status()).build();
    repo.save(c);
    return toDto(c);
  }
  @Override public CustomerResponse get(Long id){
    return toDto(repo.findById(id).orElseThrow(() -> new NotFoundException("Customer not found")));
  }
  @Override public List<CustomerResponse> list(){
    return repo.findAll().stream().map(this::toDto).toList();
  }
  @Override public CustomerResponse update(Long id, CustomerCreateRequest r){
    var c = repo.findById(id).orElseThrow(() -> new NotFoundException("Customer not found"));
    c.setAccountNumber(r.accountNumber());
    c.setCustomerName(r.customerName());
    c.setAddress(r.address());
    c.setTelephoneNumber(r.telephoneNumber());
    c.setRegistrationDate(r.registrationDate());
    c.setStatus(r.status());
    repo.save(c);
    return toDto(c);
  }
  @Override public void delete(Long id){ repo.deleteById(id); }

  private CustomerResponse toDto(Customer c){
    return new CustomerResponse(c.getCustomerId(), c.getAccountNumber(), c.getCustomerName(),
      c.getAddress(), c.getTelephoneNumber(), c.getRegistrationDate(), c.getStatus());
  }
}
