// repository/ItemRepository.java
package com.pahana.edu.billing.repository;
import com.pahana.edu.billing.domain.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> { }
