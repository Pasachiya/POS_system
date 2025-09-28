// domain/entity/Bill.java
package com.pahana.edu.billing.domain.entity;

import com.pahana.edu.billing.domain.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "bills")
public class Bill {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long billId;

  @Column(nullable=false, unique=true, length=30)
  private String billNumber;

  @ManyToOne @JoinColumn(name="customer_id", nullable=false)
  private Customer customer;

  private LocalDate billDate;

  @Column(nullable=false) private Double totalAmount;
  @Column(nullable=false) private Double taxAmount;

  @Enumerated(EnumType.STRING)
  @Column(nullable=false, length=20)
  @Builder.Default
  private PaymentStatus paymentStatus = PaymentStatus.PENDING;

  @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<BillItem> items = new ArrayList<>();
}
