package com.chatapp.controller;

import java.security.Principal;
import java.util.List;
import java.util.Set;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.config.WebSocketEventListener;
import com.chatapp.entity.User;
import com.chatapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	private final UserRepository userRepository;

    @GetMapping
    public List<String> getAllUsers(Principal principal) {

        String currentUser = principal.getName();

        return userRepository.findAll()
                .stream()
                .map(User::getUsername)
                .filter(username -> !username.equals(currentUser))
                .toList();
    }
    
    @GetMapping("/online")
    public Set<String> getOnlineUsers() {
        return WebSocketEventListener.getOnlineUsers();
    }
}
