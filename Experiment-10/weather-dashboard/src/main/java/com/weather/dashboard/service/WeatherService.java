package com.weather.dashboard.service;

import com.weather.dashboard.dto.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class WeatherService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url:https://api.openweathermap.org/data/2.5}")
    private String apiUrl;

    private final WebClient webClient;

    public WeatherService(WebClient.Builder webClientBuilder) {
        // ✅ Base URL for OpenWeatherMap
        this.webClient = webClientBuilder
                .baseUrl("https://api.openweathermap.org/data/2.5")
                .build();
    }

    /**
     * ✅ Core reactive method for fetching weather by city
     */
    public Mono<WeatherResponse> getWeatherByCity(String city) {
        logger.info("🌍 Fetching live weather for city: {}", city);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/weather")
                        .queryParam("q", city)
                        .queryParam("appid", apiKey)
                        .queryParam("units", "metric")
                        .build())
                .retrieve()
                // Handle 4xx errors gracefully
                .onStatus(HttpStatusCode::is4xxClientError, response ->
                        response.bodyToMono(String.class).flatMap(body -> {
                            HttpStatusCode code = response.statusCode();
                            if (code.value() == HttpStatus.NOT_FOUND.value()) {
                                return Mono.error(new RuntimeException("City not found: " + city));
                            } else if (code.value() == HttpStatus.UNAUTHORIZED.value()) {
                                return Mono.error(new RuntimeException("Invalid API key"));
                            }
                            return Mono.error(new RuntimeException("Client error: " + body));
                        })
                )
                // Handle 5xx errors gracefully
                .onStatus(HttpStatusCode::is5xxServerError, response ->
                        response.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new RuntimeException("Weather service error: " + body)))
                )
                .bodyToMono(WeatherResponse.class)
                // Timeout in case API hangs
                .timeout(Duration.ofSeconds(5))
                .onErrorResume(WebClientResponseException.class, e -> {
                    logger.error("🌩️ API error while fetching '{}': {}", city, e.getMessage());
                    return Mono.error(new RuntimeException("Weather API error: " + e.getMessage()));
                })
                .onErrorResume(Exception.class, e -> {
                    logger.error("🚨 Failed to connect to weather service for '{}': {}", city, e.getMessage());
                    return Mono.error(new RuntimeException("Unable to connect to weather service"));
                });
    }

    /**
     * ✅ Blocking wrapper for synchronous controller calls
     * Used in /favorites/details endpoint
     */
    public WeatherResponse fetchWeatherByCity(String city) {
        try {
            return getWeatherByCity(city).block(Duration.ofSeconds(6));
        } catch (Exception e) {
            logger.error("🌩️ Failed to fetch weather for '{}': {}", city, e.getMessage());
            throw new RuntimeException("Failed to fetch weather for '" + city + "': " + e.getMessage());
        }
    }

    /**
     * ✅ Fetch weather by coordinates (for geolocation)
     */
    public WeatherResponse fetchWeatherByCoordinates(double lat, double lon) {
        logger.info("📍 Fetching weather for coordinates: lat={}, lon={}", lat, lon);

        try {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/weather")
                            .queryParam("lat", lat)
                            .queryParam("lon", lon)
                            .queryParam("appid", apiKey)
                            .queryParam("units", "metric")
                            .build())
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, response ->
                            response.bodyToMono(String.class).flatMap(body ->
                                    Mono.error(new RuntimeException("Invalid coordinates or API key"))
                            )
                    )
                    .onStatus(HttpStatusCode::is5xxServerError, response ->
                            response.bodyToMono(String.class).flatMap(body ->
                                    Mono.error(new RuntimeException("Weather service error"))
                            )
                    )
                    .bodyToMono(WeatherResponse.class)
                    .timeout(Duration.ofSeconds(5))
                    .block(Duration.ofSeconds(6));
        } catch (Exception e) {
            logger.error("🌩️ Failed to fetch weather for coordinates: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch weather: " + e.getMessage());
        }
    }
}
