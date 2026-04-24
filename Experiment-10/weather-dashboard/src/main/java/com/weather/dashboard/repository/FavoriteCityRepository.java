package com.weather.dashboard.repository;

import com.weather.dashboard.entity.FavoriteCity;
import com.weather.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteCityRepository extends JpaRepository<FavoriteCity, Long> {
    List<FavoriteCity> findByUser(User user);

    // ✅ Prevent duplicate entries
    boolean existsByUserAndCityName(User user, String cityName);
    
    // 🗑️ New method to delete a city for a specific user
    void deleteByUserAndCityName(User user, String cityName);
}
