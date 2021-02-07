import { useState } from 'react';
import WeatherComponent from './weatherComponent';
import Banner from './images/banner.jpg';
import './App.css';

const WEATHER_KEY = process.env.REACT_APP_WEATHER_KEY;

const App = () => {

  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState({});
  const [errorContainer, setErrorContainer] = useState();

  const onSearchChange = e => {
    setCity(e.target.value);
  }

  const enterCheckCity = e => {
    console.log(e.key);
    if (e.key === 'Enter') {
      if (city) {
        checkCity(city);
      }
    }
  }

  const checkCity = async (cityName) => {

    if (city) {

      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WEATHER_KEY}&units=metric`);
      const res2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${WEATHER_KEY}&units=metric`);

      if (!res.ok) {
        setWeather({});
        setForecast({});
        if (res.status === 404) {
          setErrorContainer(<p className='errorContainer'>Sorry, we could not find <span className='cityError'>{city}</span>. Please check your input, and don't forget the dashes if the name of the city includes any.</p>);
          return null;
        } else {
          setErrorContainer(<p className='errorContainer'>Sorry, something went wrong, the weather data is momentarily unavailable.</p>);
          return null;
        }
      }

      const meteo = await res.json();
      const meteo2 = await res2.json();

      setErrorContainer(null);
      setWeather(meteo);
      setForecast(meteo2);
    }
  }

  return (
    <div className='globalContainer'>
      <img className='mainTitle' src={Banner} alt="Zen Weather" />
      <hr />
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Search a city"
          onChange={onSearchChange}
          onKeyPress={enterCheckCity}
          className="searchBar"
        />
        <button
          type="submit"
          className="searchButton"
          onClick={() => checkCity(city)}>Check!</button>
      </div>
      <div className="resultContainer">
        {errorContainer}
        {
          (weather.name && forecast.cod) ? (<WeatherComponent weather={weather} forecast={forecast} />) : null
        }
      </div>
      <footer>
        <hr />
        <p className="credit"><a href="https://zentown.dev" rel="noopener">ZenTown</a> - 2021</p>
      </footer>
    </div>
  )
}

export default App;
