package com.pahana.edu.billing.service.impl;

import com.pahana.edu.billing.domain.dto.item.ItemCreateRequest;
import com.pahana.edu.billing.domain.dto.item.ItemResponse;
import com.pahana.edu.billing.domain.dto.item.ItemUpdateRequest;
import com.pahana.edu.billing.domain.entity.Item;
import com.pahana.edu.billing.exception.NotFoundException;
import com.pahana.edu.billing.repository.ItemRepository;
import com.pahana.edu.billing.service.interfaces.ItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceImplTest {

  @Mock
  private ItemRepository repo;

  private ItemService service;

  @BeforeEach
  void setUp() {
    service = new ItemServiceImpl(repo);
  }

  @Test
  void create_returnsResponse() {
    var req = new ItemCreateRequest("Book", "GENERAL", 10.50, 5);
    when(repo.save(any(Item.class))).thenAnswer(invocation -> invocation.getArgument(0));

    ItemResponse res = service.create(req);

    assertEquals("Book", res.itemName());
    assertEquals("GENERAL", res.category());
    assertEquals(10.50, res.price());
    assertEquals(5, res.stockQuantity());
  }

  @Test
  void get_whenFound_returnsMappedDto() {
    var entity = item("Notebook", "STATIONERY", 3.25, 12);
    when(repo.findById(1L)).thenReturn(Optional.of(entity));

    var res = service.get(1L);

    assertEquals("Notebook", res.itemName());
    assertEquals("STATIONERY", res.category());
    assertEquals(3.25, res.price());
    assertEquals(12, res.stockQuantity());
  }

  @Test
  void get_whenNotFound_throws() {
    when(repo.findById(99L)).thenReturn(Optional.empty());
    assertThrows(NotFoundException.class, () -> service.get(99L));
  }

  @Test
  void list_returnsAllMappedDtos() {
    var e1 = item("Pen", "STATIONERY", 1.10, 100);
    var e2 = item("Eraser", "STATIONERY", 0.50, 200);
    when(repo.findAll()).thenReturn(List.of(e1, e2));

    var list = service.list();

    assertEquals(2, list.size());
    assertEquals("Pen", list.get(0).itemName());
    assertEquals("Eraser", list.get(1).itemName());
  }

  @Test
  void update_updatesFieldsAndSaves() {
    var existing = item("Old", "CAT", 1.00, 1);
    when(repo.findById(10L)).thenReturn(Optional.of(existing));

    var req = new ItemUpdateRequest("New", "NEWCAT", 2.50, 10);
    var res = service.update(10L, req);

    verify(repo).save(existing);
    assertEquals("New", res.itemName());
    assertEquals("NEWCAT", res.category());
    assertEquals(2.50, res.price());
    assertEquals(10, res.stockQuantity());
  }

  @Test
  void delete_delegatesToRepository() {
    service.delete(5L);
    verify(repo).deleteById(5L);
  }

  private Item item(String name, String category, double price, Integer qty) {
    return Item.builder()
      .itemName(name)
      .category(category)
      .price(price)
      .stockQuantity(qty)
      .build();
  }
}