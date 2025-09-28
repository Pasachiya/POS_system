// repository/AdminRepository.java
package com.pahana.edu.billing.repository;
import com.pahana.edu.billing.domain.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> { }