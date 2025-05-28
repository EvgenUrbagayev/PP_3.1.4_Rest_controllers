package ru.kata.spring.boot_security.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.DAO.RoleRepository;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.Collections;

@Component
@Transactional
public class UserInitializer implements CommandLineRunner {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    @Autowired
    public UserInitializer(UserService userService, RoleRepository roleRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
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
        userService.saveUser(user);


        User admin = new User();
        admin.setName("admin");
        admin.setSurname("Adminov");
        admin.setAge(40);
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRoles(Collections.singleton(adminRole));
        userService.saveUser(admin);

    }
}
