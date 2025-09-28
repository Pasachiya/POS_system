// api/CustomerController.java
package com.pahana.edu.billing.api;

import com.pahana.edu.billing.domain.dto.customer.*;
import com.pahana.edu.billing.service.interfaces.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/customers") @RequiredArgsConstructor
public class CustomerController {
  private final CustomerService service;

  @PostMapping public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerCreateRequest r){ return ResponseEntity.ok(service.create(r)); }
  @GetMapping("/{id}") public ResponseEntity<CustomerResponse> get(@PathVariable Long id){ return ResponseEntity.ok(service.get(id)); }
  @GetMapping public ResponseEntity<List<CustomerResponse>> list(){ return ResponseEntity.ok(service.list()); }
  @PutMapping("/{id}") public ResponseEntity<CustomerResponse> update(@PathVariable Long id,@Valid @RequestBody CustomerCreateRequest r){ return ResponseEntity.ok(service.update(id,r)); }
  @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){ service.delete(id); return ResponseEntity.noContent().build(); }
}
