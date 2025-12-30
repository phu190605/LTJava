package com.aesp.backend.controller;

import com.aesp.backend.entity.User;
import com.aesp.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin(origins = "*")
public class UserAdminController {

    private final UserService userService;

    public UserAdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}/disable")
    public void disableUser(@PathVariable Long id) {
        userService.disableUser(id);
    }
}
