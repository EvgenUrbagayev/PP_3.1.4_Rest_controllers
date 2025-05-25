package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {
    List<Role> findAll();

    Role findById(Long id);

    Set<Role> findRolesByIds(List<Long> ids);
}
