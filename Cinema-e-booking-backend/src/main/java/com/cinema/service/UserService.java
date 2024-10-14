package com.cinema.service;

import com.cinema.model.User;
import com.cinema.model.UserBillingAddress;
import com.cinema.model.UserPaymentMethod;
import com.cinema.repository.UserBillingAddressRepository;
import com.cinema.repository.UserPaymentMethodRepository;
import com.cinema.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserBillingAddressRepository billingAddressRepository;

    @Autowired
    private UserPaymentMethodRepository paymentMethodRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Map<String, String> resetCodeStore = new HashMap<>();

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            throw new IllegalArgumentException("Email already in use.");
        }

        // Encrypt the password before saving
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        String verificationCode = UUID.randomUUID().toString().substring(0, 6);
        user.setVerificationCode(verificationCode);
        user.setVerified(false);

        // Set role to 'user' by default, unless specified
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("user");
        }

        User savedUser = userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);

        return savedUser;
    }

    public boolean verifyUser(String email, String verificationCode) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getVerificationCode().equals(verificationCode)) {
            user.setVerified(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public User verifyLogin(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public User updateUserProfile(String email, User updatedUser) {
        User existingUser = userRepository.findByEmail(email);

        if (existingUser == null) {
            throw new IllegalArgumentException("User not found.");
        }

        existingUser.setName(updatedUser.getName());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setStreet(updatedUser.getStreet());
        existingUser.setCity(updatedUser.getCity());
        existingUser.setState(updatedUser.getState());
        existingUser.setZip(updatedUser.getZip());
        existingUser.setSubscribeToPromotions(updatedUser.getSubscribeToPromotions());


        return userRepository.save(existingUser);
    }

    public void changeUserPassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email);

        if (user == null || !passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public boolean resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) return false;

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    public void saveResetCode(String email, String resetCode) {
        resetCodeStore.put(email, resetCode);
    }

    public boolean verifyResetCode(String email, String code) {
        return code.equals(resetCodeStore.get(email));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    public User updateUser(Long id, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setRole(updatedUser.getRole());
            return userRepository.save(existingUser);
        }
        return null;
    }

    public boolean deleteUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return true;
        }
        return false;
    }

    public List<String> getSubscribedUserEmails() {
        return userRepository.findSubscribedUserEmails();
    }

    public User getUserInfo(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User updateUserPaymentCards(User updatedUser) {
        User user = getUserByEmail(updatedUser.getEmail());

        userRepository.save(user);
        return user;
    }

    // New methods for managing billing addresses and payment methods

    public List<UserBillingAddress> getUserBillingAddresses(Long userId) {
        return billingAddressRepository.findByUserId(userId);
    }

    public UserBillingAddress addBillingAddress(UserBillingAddress billingAddress) {
        return billingAddressRepository.save(billingAddress);
    }

    public List<UserPaymentMethod> getUserPaymentMethods(Long userId) {
        return paymentMethodRepository.findByUserId(userId);
    }

    public UserPaymentMethod addPaymentMethod(UserPaymentMethod paymentMethod) {
        return paymentMethodRepository.save(paymentMethod);
    }

    // Newly added updateUserCards method for updating user payment methods
    public void updateUserCards(Long userId, Map<String, String> cardDetails) {
        List<UserPaymentMethod> userPaymentMethods = paymentMethodRepository.findByUserId(userId);

        if (!userPaymentMethods.isEmpty()) {
            for (UserPaymentMethod paymentMethod : userPaymentMethods) {
                if (cardDetails.containsKey("cardNumber")) {
                    paymentMethod.setCardNumber(cardDetails.get("cardNumber"));
                }
                if (cardDetails.containsKey("expirationDate")) {
                    paymentMethod.setExpirationDate(cardDetails.get("expirationDate"));
                }
                if (cardDetails.containsKey("cvv")) {
                    paymentMethod.setCvv(cardDetails.get("cvv"));
                }
                if (cardDetails.containsKey("cardType")) {
                    paymentMethod.setCardType(cardDetails.get("cardType"));
                }
                paymentMethodRepository.save(paymentMethod);
            }
        } else {
            UserPaymentMethod newPaymentMethod = new UserPaymentMethod();
            newPaymentMethod.setUserId(userId);
            newPaymentMethod.setCardNumber(cardDetails.getOrDefault("cardNumber", ""));
            newPaymentMethod.setExpirationDate(cardDetails.getOrDefault("expirationDate", ""));
            newPaymentMethod.setCvv(cardDetails.getOrDefault("cvv", ""));
            newPaymentMethod.setCardType(cardDetails.getOrDefault("cardType", ""));
            paymentMethodRepository.save(newPaymentMethod);
        }
    }

    @Transactional
    public void updateBillingAddress(String email, UserBillingAddress updatedAddress) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found.");
        }

        Optional<UserBillingAddress> existingAddressOpt = billingAddressRepository.findByUserId(user.getId()).stream().findFirst();

        UserBillingAddress billingAddress = existingAddressOpt.orElse(new UserBillingAddress());
        billingAddress.setUserId(user.getId());
        billingAddress.setBillingStreet(updatedAddress.getBillingStreet());
        billingAddress.setBillingCity(updatedAddress.getBillingCity());
        billingAddress.setBillingState(updatedAddress.getBillingState());
        billingAddress.setBillingZip(updatedAddress.getBillingZip());

        billingAddressRepository.save(billingAddress);
    }

    public void updateUserPaymentMethods(String email, List<UserPaymentMethod> paymentMethods) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found.");
        }

        // Delete existing payment methods and replace them
        paymentMethodRepository.deleteByUserId(user.getId());

        for (UserPaymentMethod paymentMethod : paymentMethods) {
            paymentMethod.setUserId(user.getId()); // Set the user ID
            paymentMethodRepository.save(paymentMethod); // Save each new payment method
        }
    }

    public UserBillingAddress getBillingAddress(Long userId) {
        return billingAddressRepository.findByUserId(userId).stream().findFirst().orElse(null);
    }

    public List<UserPaymentMethod> getPaymentMethods(Long userId) {
        return paymentMethodRepository.findByUserId(userId);
    }

}
