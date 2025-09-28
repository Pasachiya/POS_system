package com.pahana.edu.billing.service.interfaces;

import com.pahana.edu.billing.exception.NotFoundException;
import com.pahana.edu.billing.repository.ItemRepository;
import com.pahana.edu.billing.service.impl.ItemServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

  @Test
  void canInstantiateImplementationViaInterface_andThrowsOnMissingItem() {
    ItemRepository repo = mock(ItemRepository.class);
    ItemService service = new ItemServiceImpl(repo);

    when(repo.findById(123L)).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> service.get(123L));
    assertNotNull(service);
  }
}