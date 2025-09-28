// PahanaEduBillingApplication.java
package com.pahana.edu.billing;

import com.pahana.edu.billing.domain.entity.User;
import com.pahana.edu.billing.domain.enums.UserType;
import com.pahana.edu.billing.repository.UserRepository;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PahanaEduBillingApplication {
  public static void main(String[] args){ SpringApplication.run(PahanaEduBillingApplication.class, args); }

  @Bean
  CommandLineRunner seed(UserRepository users, PasswordEncoder encoder){
    return args -> {
      if(!users.existsByUsername("admin")){
        users.save(User.builder()
          .username("admin")
          .password(encoder.encode("admin123"))
          .email("admin@pahana.edu")
          .userType(UserType.ADMIN)
          .build());
      }
    };
  }
}
