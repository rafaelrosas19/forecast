const APIkey = "4e60a50b6774cfdb04c9eaa6a647ec67"
let cityArr =  localStorage.getItem("cityArr")?JSON.parse(localStorage.getItem("cityArr")) :[]
function currentWeather(city){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

        $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
        $(".humidity").text("Humidity: " + response.main.humidity + " %");
        $(".temp").text("Temperature: " + response.main.temp.toFixed(2) + " F");

        var lat = response.coord.lat
        var lon = response.coord.lon

        function currentUV() {
            var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response){
                console.log(response);

                $(".uv").text("UV Index: " + response.value);
            
            })
        }
        
        currentUV();
        
        
    })
}

function fiveDay(city){
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIkey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

        for (var i = 1, j = 4; i < 6 && j < 60; i++ , j += 8 ){

            var img = response.list[j].weather[0].icon;
            var imgURL = "https://openweathermap.org/img/wn/" + img +"@2x.png";
            
            $(".card-date-"+[i]).html("<h5>" + moment(response.list[j].dt,"X").format("LL"));
            $(".img-"+[i]).attr("src", imgURL );
            $(".description-"+[i]).text(response.list[j].weather[0].description);
            $(".temp-"+[i]).text("Temperature: " + response.list[j].main.temp.toFixed(2) + " F");
            $(".humidity-"+[i]).text("Humidity: " + response.list[j].main.humidity + " %");
            $(".time-of-day-"+[i]).html("<small>" + response.list[j].dt_txt);
        }   
    })
}


$("#select-city").on("click",function(event) {
    event.preventDefault();
    var inputCity = $("#input-city").val().trim();

    cityArr.push(inputCity);
    localStorage.setItem("cityArr",JSON.stringify(cityArr))
    currentWeather(inputCity);
    fiveDay(inputCity);
    cityArr = JSON.parse(localStorage.getItem("cityArr"));
    createCityList();
})


function createCityList(){
    $(".city-append").empty()
     for (var i = 0; i < cityArr.length; i++){
        $(".city-append").append(`<div class="city1" >${cityArr[i]}</div>`)
     }
     $(".city1").on("click",function(event){
         var inputCity = $(this).text()
        currentWeather(inputCity);
        fiveDay(inputCity);
     })
}
createCityList();
