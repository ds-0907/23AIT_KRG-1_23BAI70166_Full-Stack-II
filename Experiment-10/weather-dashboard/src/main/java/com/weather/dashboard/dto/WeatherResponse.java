package com.weather.dashboard.dto;

import lombok.Data;
import java.util.List;

@Data
public class WeatherResponse {
    private String name;
    private Main main;
    private List<Weather> weather;
    private Wind wind;
    private Sys sys;
    private long dt;
    private int timezone;
    
    @Data
    public static class Main {
        private double temp;
        private int humidity;
        private double feels_like;
        private double temp_min;
        private double temp_max;
        private int pressure;
    }
    
    @Data
    public static class Weather {
        private String main;
        private String description;
        private String icon;
    }
    
    @Data
    public static class Wind {
        private double speed;
        private int deg;
    }
    
    @Data
    public static class Sys {
        private String country;
        private long sunrise;
        private long sunset;
    }
}