package ru.kata.spring.boot_security.demo.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserRestController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UserRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/user")
    public ResponseEntity<User> showUserInfo(Principal principal) {

        return ResponseEntity.ok(userService.findByUsername(principal.getName()));
    }

    @GetMapping("/admin-list/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/admin-list/roles")
    public List<List<Role>> getAllRoles() {
        return Collections.singletonList(roleService.findAll());
    }

    @GetMapping("/admin-list/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping("/admin-list/users")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        System.out.println("Received user: " + user);
        userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/admin-list/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/admin-list/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin-list/current")
    public ResponseEntity<User> getCurrentAdmin(Principal principal) {
        return ResponseEntity.ok(userService.findByUsername(principal.getName()));
    }




//    @GetMapping("/admin")
//    public String findAll(Model model, Principal principal) {
//        model.addAttribute("user", userService.findByUsername(principal.getName()));
//        model.addAttribute("users", userService.findAll());
//        model.addAttribute("roles", roleService.findAll());
//        model.addAttribute("newUser", new User());
//        return "admin-list";
//    }
//
//    @PostMapping("admin/saveUser")
//    public String addUser(@ModelAttribute("newUser") User user,
//                          @RequestParam("roles") List<Long> roleIds) {
//        Set<Role> roles = roleIds.stream()
//                .map(roleService::findById)
//                .collect(Collectors.toSet());
//        user.setRoles(roles);
//        userService.saveUser(user);
//        return "redirect:/admin";
//    }
//
//    @PostMapping("admin/updateUser")
//    public String updateUser(@ModelAttribute User user,
//                             @RequestParam("roles") List<Long> roleIds) {
//        user.setRoles(roleService.findRolesByIds(roleIds));
//        userService.updateUser(user);
//        return "redirect:/admin";
//    }
//
//    @PostMapping("admin/deleteUser")
//    public String deleteUser(@RequestParam("id") Long id) {
//        userService.deleteUser(id);
//        return "redirect:/admin";
//    }
}

