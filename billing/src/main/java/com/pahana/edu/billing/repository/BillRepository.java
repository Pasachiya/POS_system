// repository/BillRepository.java
package com.pahana.edu.billing.repository;
import com.pahana.edu.billing.domain.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
  List<Bill> findByCustomer_CustomerId(Long customerId);
  boolean existsByBillNumber(String billNumber);
}