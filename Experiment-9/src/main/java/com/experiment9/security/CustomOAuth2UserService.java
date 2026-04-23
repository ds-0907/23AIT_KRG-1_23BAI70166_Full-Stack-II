package com.experiment9.security;

import com.experiment9.entity.ERole;
import com.experiment9.entity.Role;
import com.experiment9.entity.User;
import com.experiment9.repository.RoleRepository;
import com.experiment9.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        // Find or create user
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found."));

            User newUser = User.builder()
                    .username(name)
                    .email(email)
                    .provider("google")
                    .providerId(providerId)
                    .roles(Set.of(userRole))
                    .build();
            return userRepository.save(newUser);
        });

        // Build authorities from roles
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());
        attributes.put("id", user.getId());
        attributes.put("roles", user.getRoles().stream()
                .map(r -> r.getName().name()).collect(Collectors.toList()));

        return new DefaultOAuth2User(authorities, attributes, "name");
    }
}
