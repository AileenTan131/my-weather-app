function formatDay(timestamp) {
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let date = new Date(timestamp * 1000);
  let forecastDay = days[date.getDay()];
  return forecastDay;
}
//Duplicating 7 days using an array, load 7 day forecast api
function displayForecast(response) {
  debugger;
  let forecastDay = response.data.daily;
  let forecastElement = document.querySelector("#row-week-forecast");
  let forecastHTML = `<div class="row gx-0">`;
  forecastDay.forEach(dailyForecast);
  function dailyForecast(forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2">
  <div> ${formatDay(forecastDay.dt)}</div>
  <div>
    <img src="http://openweathermap.org/img/wn/${
      forecastDay.weather[0].icon
    }@2x.png"
    />
   </div>
    <span class="temp-range">
    <strong> ${Math.round(forecastDay.temp.max)}°C </strong>
    / ${Math.round(forecastDay.temp.min)}°C
    </span>`;
    }
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  }
}
//new api for 7 day forcast details
function getForecast(coordinates) {
  let apiKey = "87675437846ea8c4242459c1be7a1969";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}
//date & time data
function formatDate(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Semptember",
    "October",
    "November",
    "December",
  ];
  let now = new Date(timestamp);
  let day = days[now.getDay()];
  let date = now.getDate();
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}
function formatTime(timestamp) {
  let now = new Date(timestamp);
  let hour = now.getHours();

  if (hour < 10) {
    hour = `0${hour}`;
  }
  let min = now.getMinutes();
  if (min < 10) {
    min = `0${min}`;
  }

  return `${hour}:${min}`;
}

//Insert city/current location data into the innerHTMLs, convert between celcius & fahrenheit
function getTemperature(response) {
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind-speed").innerHTML = response.data.wind.speed;
  document.querySelector("#country").innerHTML = response.data.name;
  document.querySelector("#sky-condition").innerHTML =
    response.data.weather[0].description;

  let iconType = response.data.weather[0].icon;
  let mainWeatherIcon = document.querySelector("#main-weather-icon");
  let degTemp = (document.querySelector("#temp").innerHTML = Math.round(
    response.data.main.temp
  ));
  mainWeatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconType}@2x.png`
  );
  mainWeatherIcon.setAttribute("alt", response.data.weather[0].description);

  function fahrenheitNew(event) {
    event.preventDefault();
    celciusHref.classList.remove("active");
    fahrenheit.classList.add("active");
    let temperature = document.querySelector("#temp");
    temperature.innerHTML = Math.round((degTemp * 9) / 5 + 32);
  }
  function celcius() {
    event.preventDefault();
    celciusHref.classList.add("active");
    fahrenheit.classList.remove("active");
    let temperature = document.querySelector("#temp");
    temperature.innerHTML = degTemp;
  }

  let celciusHref = document.querySelector("#celcius");
  celciusHref.addEventListener("click", celcius);
  let fahrenheit = document.querySelector("#fahrenheit");
  fahrenheit.addEventListener("click", fahrenheitNew);
  let currentTime = document.querySelector("#time");
  currentTime.innerHTML = formatTime(response.data.dt * 1000);
  let currentDate = document.querySelector("#day-month");
  currentDate.innerHTML = formatDate(response.data.dt * 1000);

  getForecast(response.data.coord); //Create new function for 7 days forecast
}

//Create Api using navigator.geolocation's lon & lat to display current data
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "87675437846ea8c4242459c1be7a1969";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getTemperature);
}
function currentData(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
//Create Api using the city name to display current data
function search(city) {
  let apiKey = "87675437846ea8c4242459c1be7a1969";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getTemperature);
}
function city(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value; //select the search bar (variable that is keyed in by the user)
  search(city);
}

//select city form (input bar + submit button)
let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", city);
//select current button
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", currentData);

//default load page country to display to the user
search("New York");
