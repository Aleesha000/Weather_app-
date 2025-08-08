import React, { useState } from "react";
import bg from "./bg.avif";
import icon from "./icon.png";
import { UseQuery } from "./UseQuery";
import { useEffect } from "react";

function WeatherAPI() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const { data, isError, isLoading, refetch } = UseQuery(city);


useEffect(() => {
  const getCityFromLocation = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=2df234f416ee41b681575704250808&q=${lat},${lon}`
      );
      const locations = await res.json();
      console.log("Location Search Response:", locations);

      if (locations && locations.length > 0) {
        const cityName = locations[0].name;
        setCity(cityName);
      } else {
        setCity("Karachi"); 
      }

      refetch(); 
    } catch (err) {
      console.error("Error getting city from location:", err);
      setCity("Karachi"); 
      refetch();
    }
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getCityFromLocation(latitude, longitude);
    },
    (error) => {
      console.warn("Location access denied:", error);
      setCity("Karachi"); 
      refetch();
    }
  );
}, []);



  const fetchSuggestions = async (value) => {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=2df234f416ee41b681575704250808&q=${value}`
    );
    const data = await res.json();
    console.log("Suggestions:", data);
    setSuggestions(data);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
  }
};
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: `url(${bg})` }}>
      <div>
        <h1 className="text-center text-4xl font-bold pt-3">🌤️ Weather App</h1>
      </div>

 <div className="pt-4 text-center flex justify-center">
  <div className="relative w-64">
    <img
      src={icon} alt="search-icon" onClick={refetch} title="Search"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-70 hover:scale-105 cursor-pointer"
    />
     <input type="text" placeholder="Enter city name" value={city} autoComplete="off" 
      onChange={(e) => {
  const value = e.target.value;
  console.log("Typed value:", value);
  setCity(value);

  if (value.length > 2) {
    fetchSuggestions(value); 
  } else {
    setSuggestions([]);
  }
}}

   onKeyDown={(e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        const selected = suggestions[highlightedIndex];
        setCity(selected.name);
        setSuggestions([]);
        refetch(); 
      } else {
        refetch(); 
        setSuggestions([]);
      }
    }
  }}
  onBlur={() => {
    setTimeout(() => setSuggestions([]), 100);
  }}

className="pr-10  pl-4 py-2 border rounded-xl shadow w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>


{suggestions.length > 0 && (
  <div className="absolute left-0 bg-white shadow-md rounded-md mt-1 w-full z-10 max-h-60 overflow-y-auto">
    {suggestions.map((s, index) => (
      <div
        key={index}
        onClick={async() => {
          await setCity(s.name);
          setSuggestions([]);
          refetch();
        }}
        // className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
        className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
      index === highlightedIndex ? "bg-blue-100" : ""}`}
      >
        {s.name}, {s.country}
      </div>
    ))}
  </div>
)}
  </div>

  <button
    className="ml-2 px-4 py-2 rounded-xl shadow bg-blue-500 text-white hover:scale-105"
    onClick={refetch}>
    Search
  </button>
</div>

      {isLoading && (<p className="text-center text-lg text-blue-800 font-semibold mt-4">Loading...</p>)}
      {isError && (<p className="text-center text-red-700 font-semibold mt-4">Couldn't find the location. Please try again.</p>)}

      
      {data && (
        <div>
          {/* Today's Weather */}
          <div className="bg-white bg-opacity-80 rounded-xl shadow p-6 my-6 mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Today's {data.location.name} Weather
            </h2>
            <p className="text-gray-600">{data.forecast.forecastday[0].date}</p>
            <img
              src={data.forecast.forecastday[0].day.condition.icon}
              alt="weather"
              className="mx-auto"
            />
            <p className="text-lg">
              {data.forecast.forecastday[0].day.condition.text}
            </p>
            <p>
              🌡️ Max Temp: {data.forecast.forecastday[0].day.maxtemp_c}°C
            </p>
            <p>
              ❄️ Min Temp: {data.forecast.forecastday[0].day.mintemp_c}°C
            </p>
            <p>💧 Humidity: {data.forecast.forecastday[0].day.avghumidity}%</p>
          </div>

          {/* Hourly Forecast */}
          <div className="bg-white bg-opacity-80 rounded-xl shadow p-4 mx-4 mb-6">
            <h3 className="text-xl font-semibold text-center mb-4">
              Hourly Forecast
            </h3>
            <div className="flex overflow-x-auto space-x-4 px-2 pb-2">
              {data.forecast.forecastday[0].hour.map((hour, index) => (
                <div
                  key={index}
                  className="min-w-[100px] p-2 bg-blue-100 rounded-lg shadow text-center"
                >
                  <p className="text-sm font-medium">
                    {hour.time.split(" ")[1]}
                  </p>
                  <img src={hour.condition.icon} alt="icon" className="mx-auto" />
                  <p className="text-sm">{hour.temp_c}°C</p>
                  <p className="text-xs">{hour.condition.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 8-Day Forecast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6 pt-8">
            {data.forecast.forecastday.map((day, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-80 rounded-xl shadow p-4 text-center"
              >
                <p className="font-semibold text-lg">{day.date}</p>
                <img
                  src={day.day.condition.icon}
                  alt="weather-icon"
                  className="mx-auto"
                />
                <p>{day.day.condition.text}</p>
                <p>🌡️ Max: {day.day.maxtemp_c}°C</p>
                <p>❄️ Min: {day.day.mintemp_c}°C</p>
                <p>💧 Humidity: {day.day.avghumidity}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherAPI
