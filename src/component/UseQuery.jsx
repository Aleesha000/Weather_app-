import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_KEY = "2df234f416ee41b681575704250808";

const fetchWeather = async (city) => {
  if (!city) throw new Error("City is required");
  
  const response = await axios.get(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=8&aqi=no&alerts=no`
  );
  return response.data;
};

export const UseQuery = (city) => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    enabled: false,
  });
};
