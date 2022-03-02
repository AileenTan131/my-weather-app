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

//Add a search engine, when searching for a city (i.e. Paris), display the city name on the page after the user submits the form.
function getTemperature(response) {
  function celcius() {
    event.preventDefault();
    celciusHref.classList.add("active");
    fahrenheit.classList.remove("active");
    let temperature = document.querySelector("#temp");
    temperature.innerHTML = degTemp;
  }
  function fahrenheitNew(event) {
    event.preventDefault();
    celciusHref.classList.remove("active");
    fahrenheit.classList.add("active");
    let temperature = document.querySelector("#temp");
    temperature.innerHTML = Math.round((degTemp * 9) / 5 + 32);
  }

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind-speed").innerHTML = response.data.wind.speed;
  document.querySelector("#country").innerHTML = response.data.name;
  document.querySelector("#sky-condition").innerHTML =
    response.data.weather[0].description;

  let degTemp = (document.querySelector("#temp").innerHTML = Math.round(
    response.data.main.temp
  ));
  let iconType = response.data.weather[0].icon;
  let mainWeatherIcon = document.querySelector("#main-weather-icon");

  mainWeatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconType}@2x.png`
  );
  mainWeatherIcon.setAttribute("alt", response.data.weather[0].description);

  let celciusHref = document.querySelector("#celcius");
  celciusHref.addEventListener("click", celcius);
  let fahrenheit = document.querySelector("#fahrenheit");
  fahrenheit.addEventListener("click", fahrenheitNew);
  let currentTime = document.querySelector("#time");
  currentTime.innerHTML = formatTime(response.data.dt * 1000);
  let currentDate = document.querySelector("#day-month");
  currentDate.innerHTML = formatDate(response.data.dt * 1000);
}

function search(city) {
  let apiKey = "87675437846ea8c4242459c1be7a1969";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getTemperature);
}
function city(event) {
  event.preventDefault();

  let city = document.querySelector("#city-input").value; //this is variable that is keyed in by the user
  search(city);
}
//Displays current data through current button
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

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", city);

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", currentData);
//In your project, display the current date and time using JavaScript: Tuesday 16:00

search("New York");
