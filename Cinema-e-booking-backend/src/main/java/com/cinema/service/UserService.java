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

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
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

    private final String encryptionKey = "your-secure-keys"; // Store securely (e.g., environment variable)

    // Encryption helper methods
    private String encrypt(String data) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(encryptionKey.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encryptedData = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encryptedData);
    }

    private String decrypt(String encryptedData) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(encryptionKey.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decryptedData = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
        return new String(decryptedData);
    }

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

            String subject = "Account Creation Confirmation";
            String message = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nYour account for Cinema eBooking has been created" +
                    "\nIf you did not create this account, please contact support immediately.";
            emailService.sendEmail(user.getEmail(), subject, message);

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

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setStreet(updatedUser.getStreet());
        existingUser.setCity(updatedUser.getCity());
        existingUser.setState(updatedUser.getState());
        existingUser.setZip(updatedUser.getZip());
        existingUser.setSubscribeToPromotions(updatedUser.getSubscribeToPromotions());

        // Notify user of the profile update
        String subject = "Profile Update Notification";
        String message = "Dear " + existingUser.getFirstName() + " " + existingUser.getLastName() + ",\n\nYour profile has been successfully updated." +
                "\nIf you did not make this change, please contact support immediately.";
        emailService.sendEmail(existingUser.getEmail(), subject, message);

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

        // Send notification email
        String subject = "Password Update Notification";
        String message = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nYour password has been successfully updated." +
                "\nIf you did not make this change, please contact support immediately.";
        emailService.sendEmail(user.getEmail(), subject, message);
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
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
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

    public List<UserPaymentMethod> getUserPaymentMethods(Long userId) {
        List<UserPaymentMethod> paymentMethods = paymentMethodRepository.findByUserId(userId);

        // Decrypt sensitive information
        for (UserPaymentMethod paymentMethod : paymentMethods) {
            try {
                paymentMethod.setCardNumber(decrypt(paymentMethod.getCardNumber()));
                paymentMethod.setExpirationDate(decrypt(paymentMethod.getExpirationDate()));
                paymentMethod.setCvv(decrypt(paymentMethod.getCvv()));
            } catch (Exception e) {
                throw new RuntimeException("Error decrypting payment method details", e);
            }
        }

        return paymentMethods;
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

    @Transactional
    public void updateUserPaymentMethods(String email, List<UserPaymentMethod> paymentMethods) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found.");
        }

        // Delete existing payment methods and replace them
        paymentMethodRepository.deleteByUserId(user.getId());

        for (UserPaymentMethod paymentMethod : paymentMethods) {
            try {
                paymentMethod.setCardNumber(encrypt(paymentMethod.getCardNumber()));
                paymentMethod.setExpirationDate(encrypt(paymentMethod.getExpirationDate()));
                paymentMethod.setCvv(encrypt(paymentMethod.getCvv()));
            } catch (Exception e) {
                throw new RuntimeException("Error encrypting payment method details", e);
            }
            paymentMethod.setUserId(user.getId()); // Set the user ID
            paymentMethodRepository.save(paymentMethod); // Save each new payment method
        }

        // Send notification email
        String subject = "Payment Method Update Notification";
        String message = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nYour payment methods have been successfully updated." +
                "\nIf you did not make this change, please contact support immediately.";
        emailService.sendEmail(user.getEmail(), subject, message);

    }

    public UserBillingAddress getBillingAddress(Long userId) {
        return billingAddressRepository.findByUserId(userId).stream().findFirst().orElse(null);
    }

    public List<UserPaymentMethod> getPaymentMethods(Long userId) {
        List<UserPaymentMethod> paymentMethods = paymentMethodRepository.findByUserId(userId);

        // Decrypt sensitive information
        for (UserPaymentMethod paymentMethod : paymentMethods) {
            try {
                paymentMethod.setCardNumber(decrypt(paymentMethod.getCardNumber()));
                paymentMethod.setExpirationDate(decrypt(paymentMethod.getExpirationDate()));
                paymentMethod.setCvv(decrypt(paymentMethod.getCvv()));
            } catch (Exception e) {
                throw new RuntimeException("Error decrypting payment method details", e);
            }
        }

        return paymentMethods;
    }

    // Method to update suspension status
    public boolean updateSuspensionStatus(Long userId, boolean isSuspended) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setSuspended(isSuspended);
            userRepository.save(user);
            return true;
        }
        return false;
    }

}
