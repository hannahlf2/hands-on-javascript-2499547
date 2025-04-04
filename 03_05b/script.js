/**
 * Build a location selector.
 * - Capture the location field input.
 * - Send a fetch query to the OpenWeather geocoding API (https://openweathermap.org/api/geocoding-api)
 * - Use the lat and lon data from the geocoding response to fetch weather data.
 */

import settings from "../settings.js";
import weatherCard from "./components/weathercard.js";

const mainContent = document.querySelector(".main-content");
const locationForm = document.querySelector(".locationform");
const formInput = document.querySelector("#location");
let location = settings.location;
let units = settings.units;
const errorMsg = document.querySelector(".error");

// Caputre location form submit
locationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  errorMsg.classList.add("hidden");
  console.log(formInput.value);
  location = formInput.value;
  displayData(location, units);
});

const unitChanger = () => {
  const unitsButton = document.querySelector("#units");
  unitsButton.addEventListener("click", () => {
    units === "metric" ? (units = "imperial") : (units = "metric");
    displayData(units);
  });
};

async function displayData(location, units) {
  const currentLocation = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&APPID=${settings.appid}`
  )
    .then((response) => response.json())
    .then(function (data) {
      if (data.length === 0) {
        errorMsg.classList.remove("hidden");
        errorMsg.innerHTML = "No location by that name. Try again.";
      } else {
        return data;
      }
    })
    .catch((error) => {
      errorMsg.classList.remove("hidden");
      errorMsg.innerHTML = "Something went wrong. Try again.";
      console.error("Location query error:", error);
    });

  if (currentLocation) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation[0].lat}&lon=${currentLocation[0].lon}&APPID=${settings.appid}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        mainContent.innerHTML = weatherCard(data, units);
      })
      .then(function () {
        unitChanger();
      });
  }
}

displayData(location, units);
