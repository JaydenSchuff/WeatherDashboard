var key = 'ed9fadfd4ede46144f21320c7fb8af05';
var city = "Seattle"

//Grabs the current time and date
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

var cityPastWeather = [];
//Will save the to an array and storage
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	cityPastWeather.push(city);

	localStorage.setItem('city', JSON.stringify(cityPastWeather));
	weatherEl.empty();
	pastWeather();
	getWeatherToday();
});

//Creates buttons based on search history 
var pastWeatherEl = $('.cityPastWeather');
function pastWeather() {
	pastWeatherEl.empty();

	for (let i = 0; i < cityPastWeather.length; i++) {

		var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${cityPastWeather[i]}`)

		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary histBtn');
		btnEl.attr('type', 'button');

		pastWeatherEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}

	$('.histBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		weatherEl.empty();
		getWeatherToday();
	});
};


var mainCard = $('.cardBodyToday')

function getWeatherToday() {
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(mainCard).empty();

	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.mainCardCity').text(response.name);
		$('.dateToday').text(date);
		
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		// Temperature
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		mainCard.append(pEl);
		//Feels Like
		var pElTemp = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
		mainCard.append(pElTemp);
		//Humidity
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		mainCard.append(pElHumid);
		//Wind Speed
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		mainCard.append(pElWind);
		//Set the lat and long from the searched city
		var cityLon = response.coord.lon;
		// console.log(cityLon);
		var cityLat = response.coord.lat;
		// console.log(cityLat);

		var getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;

		$.ajax({
			url: getUrlUvi,
			method: 'GET',
		}).then(function (response) {
			var pElUvi = $('<p>').text(`UV Index: `);
			var uviSpan = $('<span>').text(response.current.uvi);
			var uvi = response.current.uvi;
			mainCard.append(pElUvi);
		});
	});
	getFutureWeather();
};

var weatherEl = $('.weatherCards');

function getFutureWeather() {
	var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		var futureWeather = response.list;
		var myWeather = [];

		$.each(futureWeather, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				feels_like: value.main.feels_like,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
		})
		
		for (let i = 0; i < myWeather.length; i++) {

			var cardEl = $('<div>');
			cardEl.attr('class', 'card text-white bg-primary mb-3 cardOne');
			cardEl.attr('style', 'max-width: 200px;');
			weatherEl.append(cardEl);

			var headerEl = $('<div>');
			headerEl.attr('class', 'card-header')
			var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
			headerEl.text(m);
			cardEl.append(headerEl)

			var bodyEl = $('<div>');
			bodyEl.attr('class', 'card-body');
			cardEl.append(bodyEl);

			var iconEl = $('<img>');
			iconEl.attr('class', 'icons');
			iconEl.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			bodyEl.append(iconEl);

			//Temp
			var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
			bodyEl.append(pElTemp);
			//Feels Like
			var pElFeel = $('<p>').text(`Feels Like: ${myWeather[i].feels_like} °F`);
			bodyEl.append(pElFeel);
			//Humidity
			var pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			bodyEl.append(pElHumid);
		}
	});
};

//Allows for the example data to load for Seattle
function initLoad() {

	var cityPastWeatherStore = JSON.parse(localStorage.getItem('city'));

	if (cityPastWeatherStore !== null) {
		cityPastWeather = cityPastWeatherStore
	}
	pastWeather();
	getWeatherToday();
};

initLoad();