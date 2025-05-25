package ru.kata.spring.boot_security.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ru.kata.spring.boot_security.demo.DAO.RoleRepository;
import ru.kata.spring.boot_security.demo.DAO.UserRepository;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.Collections;

@Component
@Transactional
public class UserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        Role adminRole = new Role();
        adminRole.setAuthority("ROLE_ADMIN");
        roleRepository.save(adminRole);

        Role userRole = new Role();
        userRole.setAuthority("ROLE_USER");
        roleRepository.save(userRole);


        User user = new User();
        user.setName("User");
        user.setSurname("Userov");
        user.setAge(30);
        user.setPassword(passwordEncoder.encode("user"));
        user.setRoles(Collections.singleton(userRole));
        userRepository.save(user);


        User admin = new User();
        admin.setName("admin");
        admin.setSurname("Adminov");
        admin.setAge(40);
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRoles(Collections.singleton(adminRole));
        userRepository.save(admin);

    }
}
