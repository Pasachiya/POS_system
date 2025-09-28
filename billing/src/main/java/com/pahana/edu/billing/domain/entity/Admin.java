// domain/entity/Admin.java
package com.pahana.edu.billing.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "admins")
public class Admin {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long adminId;

  @OneToOne
  @JoinColumn(name="user_id", nullable=false, unique=true)
  private User user;
}
