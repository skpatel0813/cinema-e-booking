package com.cinema.repository;

import com.cinema.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);


    @Query("SELECT u.email FROM User u WHERE u.subscribeToPromotions = true")
    List<String> findSubscribedUserEmails();

}
