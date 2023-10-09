import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = '0cb2da01df89710c70d599a94e7d3e35';
const API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/forecast';

// 81 ilin listesi
const cities = [
    'Adana',
    'Adıyaman',
    'Afyonkarahisar',
    'Ağrı',
    'Amasya',
    'Ankara',
    'Antalya',
    'Artvin',
    'Aydın',
    'Balıkesir',
    'Bilecik',
    'Bingöl',
    'Bitlis',
    'Bolu',
    'Burdur',
    'Bursa',
    'Çanakkale',
    'Çankırı',
    'Çorum',
    'Denizli',
    'Diyarbakır',
    'Edirne',
    'Elazığ',
    'Erzincan',
    'Erzurum',
    'Eskişehir',
    'Gaziantep',
    'Giresun',
    'Gümüşhane',
    'Hakkari',
    'Hatay',
    'Isparta',
    'Mersin',
    'İstanbul',
    'İzmir',
    'Kars',
    'Kastamonu',
    'Kayseri',
    'Kırklareli',
    'Kırşehir',
    'Kocaeli',
    'Konya',
    'Kütahya',
    'Malatya',
    'Manisa',
    'Kahramanmaraş',
    'Mardin',
    'Muğla',
    'Muş',
    'Nevşehir',
    'Niğde',
    'Ordu',
    'Rize',
    'Sakarya',
    'Samsun',
    'Siirt',
    'Sinop',
    'Sivas',
    'Tekirdağ',
    'Tokat',
    'Trabzon',
    'Tunceli',
    'Şanlıurfa',
    'Uşak',
    'Van',
    'Yozgat',
    'Zonguldak',
    'Aksaray',
    'Bayburt',
    'Karaman',
    'Kırıkkale',
    'Batman',
    'Şırnak',
    'Bartın',
    'Ardahan',
    'Iğdır',
    'Yalova',
    'Karabük',
    'Kilis',
    'Osmaniye',
    'Düzce',  
];

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState(''); // Kullanıcının seçtiği şehir
  const [currentDay, setCurrentDay] = useState(''); // İçinde bulunduğumuz gün

  useEffect(() => {
    // Kullanıcının konum erişim izni alınıyor (tarayıcı destekliyorsa)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []);

  const getWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(API_ENDPOINT, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: 'metric',
          cnt: 7,
        },
      });
      setWeatherData(response.data.list);
      setCurrentDay(response.data.list[0].dt_txt.split(' ')[0]); // İlk günü seçili hale getir
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleCityChange = async (selectedCity) => {
    setCity(selectedCity);
    try {
      const response = await axios.get(API_ENDPOINT, {
        params: {
          q: selectedCity,
          appid: API_KEY,
          units: 'metric',
          cnt: 7,
        },
      });
      setWeatherData(response.data.list);
      setCurrentDay(response.data.list[0].dt_txt.split(' ')[0]); // İlk günü seçili hale getir
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Haftalık Hava Durumu</h1>
      <div className="city-dropdown">
        <label>Şehir seçin:</label>
        <select value={city} onChange={(e) => handleCityChange(e.target.value)}>
          <option value="">Şehir Seçin</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="weather-cards">
        {weatherData.map((data) => {
          const date = data.dt_txt.split(' ')[0];
          return (
            <div className={`weather-card ${date === currentDay ? 'current-day' : ''}`} key={data.dt}>
              <p className="day">{date}</p>
              <p className="weather-description">{data.weather[0].description}</p>
              <img
                src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
                alt={data.weather[0].description}
              />
              <p className="temperature">
                {Math.round(data.main.temp_max)}°C / {Math.round(data.main.temp_min)}°C
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
