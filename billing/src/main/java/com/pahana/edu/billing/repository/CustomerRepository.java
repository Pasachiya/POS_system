// repository/CustomerRepository.java
package com.pahana.edu.billing.repository;
import com.pahana.edu.billing.domain.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
  Optional<Customer> findByAccountNumber(String accountNumber);
}
