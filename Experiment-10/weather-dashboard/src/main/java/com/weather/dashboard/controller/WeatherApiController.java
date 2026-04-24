package com.weather.dashboard.controller;

import com.weather.dashboard.dto.WeatherResponse;
import com.weather.dashboard.entity.FavoriteCity;
import com.weather.dashboard.service.FavoriteCityService;
import com.weather.dashboard.service.WeatherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherApiController {

    private static final Logger logger = LoggerFactory.getLogger(WeatherApiController.class);

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private FavoriteCityService favService;

    // ✅ Utility: safely get logged-in username from SecurityContext
    private String getAuthenticatedUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("No valid authentication found");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        } else if (principal instanceof String) {
            return (String) principal; // JWT stores username as a string
        }

        throw new SecurityException("Invalid authentication principal");
    }

    // ✅ Public endpoint: Search live weather (no auth required)
    @GetMapping("/search")
    public ResponseEntity<?> searchWeather(@RequestParam String city) {
        logger.info("🔍 Searching weather for: {}", city);
        try {
            WeatherResponse weather = weatherService.fetchWeatherByCity(city);
            return ResponseEntity.ok(weather);
        } catch (Exception ex) {
            logger.error("🌩️ Failed to fetch weather for '{}': {}", city, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    // ✅ Public endpoint: Get weather by geolocation (no auth required)
    @GetMapping("/location")
    public ResponseEntity<?> getWeatherByLocation(@RequestParam double lat, @RequestParam double lon) {
        logger.info("📍 Fetching weather for location: lat={}, lon={}", lat, lon);
        try {
            WeatherResponse weather = weatherService.fetchWeatherByCoordinates(lat, lon);
            return ResponseEntity.ok(weather);
        } catch (Exception ex) {
            logger.error("🌩️ Failed to fetch weather for coordinates: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    // ✅ Get all favorite cities (for the logged-in user)
    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites() {
        String username = getAuthenticatedUsername();
        logger.info("📋 Fetching favorites for user: {}", username);

        List<FavoriteCity> favorites = favService.getUserFavorites(username);
        return ResponseEntity.ok(favorites);
    }

    // ✅ Add a new city to favorites
    @PostMapping("/favorites")
    public ResponseEntity<?> addFavorite(@RequestParam String city) {
        String username = getAuthenticatedUsername();
        logger.info("⭐ Adding favorite '{}' for user '{}'", city, username);

        try {
            favService.addFavorite(username, city);
            return ResponseEntity.ok(Map.of("message", city + " added to favorites"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "timestamp", new Date(),
                            "status", 400,
                            "error", ex.getMessage()
                    ));
        }
    }

    // ✅ Remove a favorite city
    @DeleteMapping("/favorites")
    public ResponseEntity<?> removeFavorite(@RequestParam String city) {
        String username = getAuthenticatedUsername();
        logger.info("🗑️ Removing '{}' from favorites for user '{}'", city, username);

        try {
            favService.removeFavorite(username, city);
            return ResponseEntity.ok(Map.of("message", city + " removed from favorites"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "timestamp", new Date(),
                            "status", 400,
                            "error", ex.getMessage()
                    ));
        }
    }

    // ✅ Rename (update) favorite city
    @PutMapping("/favorites")
    public ResponseEntity<?> updateFavorite(@RequestParam String oldCity,
                                            @RequestParam String newCity) {
        String username = getAuthenticatedUsername();
        logger.info("✏️ Renaming '{}' ➜ '{}' for user '{}'", oldCity, newCity, username);

        try {
            favService.updateFavorite(username, oldCity, newCity);
            return ResponseEntity.ok(Map.of("message", "Updated favorite city from " + oldCity + " ➜ " + newCity));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "timestamp", new Date(),
                            "status", 400,
                            "error", ex.getMessage()
                    ));
        }
    }

    // ✅ Get live weather for all favorite cities (authenticated)
    @GetMapping("/favorites/details")
    public ResponseEntity<?> getFavoritesWithWeather() {
        String username = getAuthenticatedUsername();
        List<FavoriteCity> favorites = favService.getUserFavorites(username);

        if (favorites.isEmpty()) {
            logger.info("ℹ️ No favorites found for user '{}'", username);
            return ResponseEntity.ok(Collections.emptyList());
        }

        logger.info("🔹 Fetching live weather for {} favorite city(ies).", favorites.size());
        List<Map<String, Object>> weatherData = new ArrayList<>();

        for (FavoriteCity fav : favorites) {
            try {
                WeatherResponse weather = weatherService.fetchWeatherByCity(fav.getCityName());

                Map<String, Object> cityData = new LinkedHashMap<>();
                cityData.put("cityName", weather.getName());
                cityData.put("temperature", weather.getMain().getTemp());
                cityData.put("condition", weather.getWeather() != null && !weather.getWeather().isEmpty() 
                    ? weather.getWeather().get(0).getMain() : "Unknown");
                cityData.put("description", weather.getWeather() != null && !weather.getWeather().isEmpty() 
                    ? weather.getWeather().get(0).getDescription() : "No description");
                cityData.put("humidity", weather.getMain().getHumidity());
                cityData.put("windSpeed", weather.getWind().getSpeed());
                cityData.put("country", weather.getSys() != null ? weather.getSys().getCountry() : "");
                cityData.put("timestamp", weather.getDt());

                weatherData.add(cityData);
                logger.info("✅ Weather fetched successfully for: {}", fav.getCityName());

            } catch (Exception ex) {
                logger.error("🌩️ Weather fetch failed for '{}': {}", fav.getCityName(), ex.getMessage());
                weatherData.add(Map.of(
                        "cityName", fav.getCityName(),
                        "error", "Weather API unavailable: " + ex.getMessage()
                ));
            }
        }

        return ResponseEntity.ok(weatherData);
    }
}
