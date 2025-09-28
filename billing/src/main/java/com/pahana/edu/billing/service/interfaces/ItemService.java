// service/interfaces/ItemService.java
package com.pahana.edu.billing.service.interfaces;
import com.pahana.edu.billing.domain.dto.item.*;
import java.util.List;
public interface ItemService {
  ItemResponse create(ItemCreateRequest req);
  ItemResponse get(Long id);
  List<ItemResponse> list();
  ItemResponse update(Long id, ItemUpdateRequest req);
  void delete(Long id);
}
