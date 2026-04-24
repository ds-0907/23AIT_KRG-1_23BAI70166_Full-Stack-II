package com.weather.dashboard.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    // ✅ Use a strong 64-byte key (for HS256)
    private static final String SECRET_KEY = "your-super-strong-secret-jwt-signing-key-2025-weather-dashboard-64bytes";
    private static final long EXPIRATION_TIME = 86400000L; // 1 day

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ✅ Generate JWT for a given username
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Extract username safely
    public String extractUsername(String token) {
        try {
            return extractAllClaims(token).getSubject();
        } catch (JwtException e) {
            logger.warn("❌ Failed to extract username: {}", e.getMessage());
            return null;
        }
    }

    // ✅ Extract expiration
    private Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    // ✅ Parse all claims with clock skew tolerance
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .setAllowedClockSkewSeconds(60) // 1 minute clock drift allowed
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Check if token expired
    private boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            return true; // default to expired if parsing fails
        }
    }

    // ✅ Validate token against user details
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        boolean valid = (username != null &&
                username.equals(userDetails.getUsername()) &&
                !isTokenExpired(token));

        if (!valid) {
            logger.warn("🚫 Invalid token for user: {}", userDetails.getUsername());
        }
        return valid;
    }
}
