// api/BillController.java
package com.pahana.edu.billing.api;

import com.pahana.edu.billing.domain.dto.bill.*;
import com.pahana.edu.billing.service.interfaces.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController 
@RequestMapping("/api/bills") 
@RequiredArgsConstructor
public class BillController {
  private final BillingService billing;

  // Get all bills OR bills by customer (if customerId param provided)
  @GetMapping
  public ResponseEntity<List<BillResponse>> getAllBills(
      @RequestParam(value = "customerId", required = false) Long customerId) {
    log.info("📋 GET /api/bills - customerId: {}", customerId);
    
    if (customerId != null) {
      return ResponseEntity.ok(billing.listByCustomer(customerId));
    } else {
      return ResponseEntity.ok(billing.listAll());
    }
  }

  @PostMapping 
  public ResponseEntity<BillResponse> create(@Valid @RequestBody BillCreateRequest r){
    log.info("📋 POST /api/bills - Creating new bill");
    return ResponseEntity.ok(billing.create(r));
  }

  @GetMapping("/{id}") 
  public ResponseEntity<BillResponse> get(@PathVariable("id") Long id){ 
    log.info("📋 GET /api/bills/{} - Fetching bill by ID", id);
    return ResponseEntity.ok(billing.get(id)); 
  }

  @PostMapping("/{id}/pay") 
  public ResponseEntity<BillResponse> markPaid(@PathVariable("id") Long id){
    log.info("📋 POST /api/bills/{}/pay - Marking bill as paid", id);
    return ResponseEntity.ok(billing.markPaid(id));
  }
}
