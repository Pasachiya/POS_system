// domain/entity/Customer.java
package com.pahana.edu.billing.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "customers")
public class Customer {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long customerId;

  @Column(nullable=false, unique=true, length=30)
  private String accountNumber;

  @Column(nullable=false, length=120)
  private String customerName;

  private String address;
  private String telephoneNumber;
  private LocalDate registrationDate;
  private String status;

  @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
  private List<Bill> bills;
}
