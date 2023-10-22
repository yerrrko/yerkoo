const express = require('express')
const https = require('node:https');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/app.html");
});
app.post("/", function (req, res) {
    const query = req.body.cityName;
    const key = "933308b7ddcfb3e2b1c46bb312f61f4d";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + key + "&units=metric&lang=eng";

    https.get(url, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const lon = weatherData.coord.lon;
            const lat = weatherData.coord.lat;
            const ftemp = weatherData.main.feels_like;
            const humidity = weatherData.main.humidity;
            const pressure = weatherData.main.pressure;
            const windSpeed = weatherData.wind.speed;
            const countryCode = weatherData.sys.country;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write(`<h1>
  At the location specified by longitude: ${lon} and latitude: ${lat}, with the country code ${countryCode}, the current temperature is ${temp} degrees Celsius, with a real-feel temperature of ${ftemp} degrees Celsius.
  The humidity level is recorded at ${humidity}.
  The atmospheric pressure is measured at ${pressure}.
  The wind speed is currently ${windSpeed} meters per hour.
  The weather condition is described as ${description}.</h1>
  <img src="${imageURL}"><br>
`);

            const rainurl = "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + key + "&units=metric";
            https.get(rainurl, function (rainResponse) {
                let rainData = "";

                rainResponse.on("data", function (chunk) {
                    rainData += chunk;
                });

                rainResponse.on("end", function () {

                    const rainVolume = JSON.parse(rainData);


                    var rain3h = 0;
                    if (rainVolume.list[1].rain && rainVolume.list[1].rain['3h']) {
                        rain3h = rainVolume.list[1].rain['3h'];
                    }
                    res.write("<h1>Rain volume for last 3 hours is " + rain3h + " </h1>")
                });
            });
        });

        https.get('https://api.chucknorris.io/jokes/random', function (JokeResponse) {
                JokeResponse.on('data', function (JokeData) {
                const Joke = JSON.parse(JokeData);
                console.log(Joke);
                const randomJoke = Joke.value;
                res.write(`<h1>Chuk-Norris Joke: ${randomJoke}</h1>`);
            });
        });
        https.get('https://api.adviceslip.com/advice', function (AdviceResponse) {
        AdviceResponse.on('data', function (AdviceData) {
            const Advice = JSON.parse(AdviceData);
            console.log(Advice);
            const randomAdvice = Advice.slip.advice;
            res.write(`<h1>Random Advice: ${randomAdvice}</h1>`);
        });
    });
    });

    
    
});


app.listen(3000, function () {
    console.log("Server is running on port 3000");
}); 