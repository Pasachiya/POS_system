// domain/entity/BillItem.java
package com.pahana.edu.billing.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "bill_items")
public class BillItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long billItemId;

  @ManyToOne @JoinColumn(name="bill_id", nullable=false)
  private Bill bill;

  @ManyToOne @JoinColumn(name="item_id", nullable=false)
  private Item item;

  @Column(nullable=false) private Integer quantity;
  @Column(nullable=false) private Double unitPrice;
  @Column(nullable=false) private Double subtotal;
}
