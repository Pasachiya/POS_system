// service/impl/ItemServiceImpl.java
package com.pahana.edu.billing.service.impl;

import com.pahana.edu.billing.domain.dto.item.*;
import com.pahana.edu.billing.domain.entity.Item;
import com.pahana.edu.billing.exception.NotFoundException;
import com.pahana.edu.billing.repository.ItemRepository;
import com.pahana.edu.billing.service.interfaces.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
  private final ItemRepository repo;

  @Override public ItemResponse create(ItemCreateRequest r){
    var i = Item.builder().itemName(r.itemName()).category(r.category())
               .price(r.price()).stockQuantity(r.stockQuantity()).build();
    repo.save(i);
    return toDto(i);
  }
  @Override public ItemResponse get(Long id){
    return toDto(repo.findById(id).orElseThrow(() -> new NotFoundException("Item not found")));
  }
  @Override public List<ItemResponse> list(){ return repo.findAll().stream().map(this::toDto).toList(); }
  @Override public ItemResponse update(Long id, ItemUpdateRequest r){
    var i = repo.findById(id).orElseThrow(() -> new NotFoundException("Item not found"));
    if(r.itemName()!=null) i.setItemName(r.itemName());
    if(r.category()!=null) i.setCategory(r.category());
    if(r.price()!=null) i.setPrice(r.price());
    if(r.stockQuantity()!=null) i.setStockQuantity(r.stockQuantity());
    repo.save(i); return toDto(i);
  }
  @Override public void delete(Long id){ repo.deleteById(id); }

  private ItemResponse toDto(Item i){
    return new ItemResponse(i.getItemId(), i.getItemName(), i.getCategory(), i.getPrice(), i.getStockQuantity());
  }
}
