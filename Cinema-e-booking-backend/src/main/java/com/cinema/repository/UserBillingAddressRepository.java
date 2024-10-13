package com.cinema.repository;

import com.cinema.model.UserBillingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserBillingAddressRepository extends JpaRepository<UserBillingAddress, Long> {
    List<UserBillingAddress> findByUserId(Long userId);
}
