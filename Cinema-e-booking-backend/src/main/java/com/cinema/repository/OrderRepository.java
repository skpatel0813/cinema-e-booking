package com.cinema.repository;

import com.cinema.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserEmail(String email);

    List<Order> findByMovieTitleAndShowtime(String movieTitle, String showtime);


}
