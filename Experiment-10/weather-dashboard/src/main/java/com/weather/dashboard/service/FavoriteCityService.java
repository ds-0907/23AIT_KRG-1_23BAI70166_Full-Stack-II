package com.weather.dashboard.service;

import com.weather.dashboard.entity.FavoriteCity;
import com.weather.dashboard.entity.User;
import com.weather.dashboard.repository.FavoriteCityRepository;
import com.weather.dashboard.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class FavoriteCityService {

    private static final Logger logger = LoggerFactory.getLogger(FavoriteCityService.class);

    @Autowired
    private FavoriteCityRepository favRepo;

    @Autowired
    private UserRepository userRepo;

    /**
     * ✅ Get all favorite cities for a given user
     */
    public List<FavoriteCity> getUserFavorites(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        logger.info("📋 Retrieved favorites for user: {}", username);
        return favRepo.findByUser(user);
    }

    /**
     * ✅ Add a new city to user favorites (duplicate check)
     */
    public void addFavorite(String username, String cityName) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        boolean exists = favRepo.findByUser(user).stream()
                .anyMatch(fav -> fav.getCityName().equalsIgnoreCase(cityName));

        if (exists) {
            logger.warn("⚠️ City '{}' already exists for user '{}'", cityName, username);
            throw new RuntimeException("City '" + cityName + "' already exists in favorites");
        }

        FavoriteCity fav = new FavoriteCity();
        fav.setCityName(cityName);
        fav.setUser(user);
        favRepo.save(fav);

        logger.info("✅ '{}' added to favorites for user '{}'", cityName, username);
    }

    /**
     * ✅ Remove a city from favorites (throws error if not found)
     */
    public void removeFavorite(String username, String cityName) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        FavoriteCity favorite = favRepo.findByUser(user).stream()
                .filter(fav -> fav.getCityName().equalsIgnoreCase(cityName))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("City '" + cityName + "' not found in favorites"));

        favRepo.delete(favorite);
        logger.info("🗑️ '{}' removed from favorites for user '{}'", cityName, username);
    }

    /**
     * ✅ Update (rename) a favorite city
     */
    public void updateFavorite(String username, String oldCity, String newCity) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<FavoriteCity> favorites = favRepo.findByUser(user);

        FavoriteCity existingCity = favorites.stream()
                .filter(fav -> fav.getCityName().equalsIgnoreCase(oldCity))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("City '" + oldCity + "' not found in favorites"));

        boolean alreadyExists = favorites.stream()
                .anyMatch(fav -> fav.getCityName().equalsIgnoreCase(newCity));

        if (alreadyExists) {
            logger.warn("⚠️ Attempt to rename '{}' to '{}', but it already exists for user '{}'",
                    oldCity, newCity, username);
            throw new RuntimeException("City '" + newCity + "' already exists in favorites");
        }

        existingCity.setCityName(newCity);
        favRepo.save(existingCity);
        logger.info("✏️ '{}' renamed to '{}' for user '{}'", oldCity, newCity, username);
    }
}
