// repository/BillItemRepository.java
package com.pahana.edu.billing.repository;
import com.pahana.edu.billing.domain.entity.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillItemRepository extends JpaRepository<BillItem, Long> { }