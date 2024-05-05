const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccesContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');
const grantAccesBtn = document.querySelector('[data-grantAccess]');
const errorTab = document.querySelector('.errer-container');

errorTab.classList.remove('active');

const API_KEY="b3fde73038c548e05353d7d8b92eeb11";

let currentTab = userTab;

currentTab.classList.add("current-tab");

getfornSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains('active')){
            userInfoContainer.classList.remove('active');
            grantAccesContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else{
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            errorTab.classList.remove('active');
            getfornSessionStorage();
        }
    }
}

userTab.addEventListener('click',() =>{
     switchTab(userTab);
})

searchTab.addEventListener('click',() =>{
     switchTab(searchTab);
})

function getfornSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinater")
    if(!localCoordinates){
        grantAccesContainer.classList.add("active");
    }
    else{
        const coordinater = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinater);
    }
}

async function fetchUserWeatherInfo(coordinater){

     const {lat,lon} = coordinater;

     grantAccesContainer.classList.remove('active');
     loadingScreen.classList.add('active');

     try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);

     } catch (error) {
        loadingScreen.classList.remove('active');
        errorTab.classList.add('active');
     }
}

function renderWeatherInfo(weatherInfo){

    const cityName =document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const desc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed =document.querySelector('[ data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness =document.querySelector('[data-cloudiness]');

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`; 
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

grantAccesBtn.addEventListener('click' ,getLocation);

function showPosition(position){

    const usercoordinater = {
        lat:position.coords.latitude ,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinater',JSON.stringify(usercoordinater));
    fetchUserWeatherInfo(usercoordinater);
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('No Goelocation Support');
    }
}

const searchInput = document.querySelector('[ data-searchInput]');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let cityName = searchInput.value;
    if(cityName == ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }

})

async function fetchSearchWeatherInfo(city_name){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccesContainer.classList.remove('active');

    let response;
       
    try {
        response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}&units=metric`);
        
        
    } catch (error) {
        console.log(error)
        
    }

    if (response?.ok) {
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        errorTab.classList.remove('active');
        renderWeatherInfo(data);
    } else {
        loadingScreen.classList.remove('active');
        errorTab.classList.add('active');
    }
}