// api/ItemController.java
package com.pahana.edu.billing.api;

import com.pahana.edu.billing.domain.dto.item.*;
import com.pahana.edu.billing.service.interfaces.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/items") @RequiredArgsConstructor
public class ItemController {
  private final ItemService service;

  @PostMapping public ResponseEntity<ItemResponse> create(@Valid @RequestBody ItemCreateRequest r){ return ResponseEntity.ok(service.create(r)); }
  @GetMapping("/{id}") public ResponseEntity<ItemResponse> get(@PathVariable Long id){ return ResponseEntity.ok(service.get(id)); }
  @GetMapping public ResponseEntity<List<ItemResponse>> list(){ return ResponseEntity.ok(service.list()); }
  @PutMapping("/{id}") public ResponseEntity<ItemResponse> update(@PathVariable Long id, @RequestBody ItemUpdateRequest r){ return ResponseEntity.ok(service.update(id,r)); }
  @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){ service.delete(id); return ResponseEntity.noContent().build(); }
}
