import { useState, useEffect } from 'react';
import './App.css';

const WeatherComponent = ({ weather, forecast }) => {

    const timeArray = ['Now: ', 'In 6 Hours', 'In 12 Hours', 'In 24 Hours', 'In 36 Hours', 'In 48 Hours'];
    const forecastWeatherArray = [weather, forecast.list[1], forecast.list[3], forecast.list[7], forecast.list[11], forecast.list[15]]
    const [forecastWeather, setForecastWeather] = useState(forecastWeatherArray[0])
    const [time, setTime] = useState(0);
    const [forecastTime, setForecastTime] = useState(timeArray[0]);

    const getProperTime = someTime => {
        const unix_timestamp = someTime;
        const date = new Date(unix_timestamp * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const proper_time = `${hours}h${minutes.substr(-2)}`;
        return proper_time;
    }

    const changeTime = direction => {
        if (direction === 'up') {
            setTime(time + 1);
        } else if (direction === 'down') {
            setTime(time - 1);
        }
    }

    useEffect(() => {
        setForecastTime(timeArray[time]);
        setForecastWeather(forecastWeatherArray[time]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time, weather, forecast])

    useEffect(() => {
        setTime(0);
    }, [weather, forecast])

    const isCurrentTime = () => {
        if (time === 0) {
            return (
                <span className='deactivatedButton'>{`<`}</span>
            );
        } else {
            return (
                <span
                    className='moveButton'
                    onClick={() => changeTime('down')}>{`<`}</span>
            )
        }
    }

    const isMaxTime = () => {
        if (time === (timeArray.length - 1)) {
            return (
                <span className='deactivatedButton'>{`>`}</span>
            );
        } else {
            return (
                <span className='moveButton'
                    onClick={() => changeTime('up')}>{`>`}</span>
            )
        }
    }

    const whatTime = () => {
        if (time === 0) {
            return (<span className='weatherData'>{getProperTime(weather.dt + weather.timezone)}</span>);
        } else {
            return null;
        }
    }

    const roundToOne = number => {
        return (Math.round(number * 10) / 10);
    }

    return (
        <>
            <div className="titleContainer">
                <h1>{weather.name}</h1>
                <img src={`http://openweathermap.org/img/wn/${forecastWeather.weather[0].icon}@2x.png`} alt='' />
            </div>

            <div className="timeContainer">
                <p>{isCurrentTime()}{forecastTime}{whatTime()}{isMaxTime()}</p>
            </div>

            <ul className='temperature'>
                <li>Temperature: <span className='weatherData'>{roundToOne(forecastWeather.main.temp)}°C</span></li>
                <li>Feels Like: <span className='weatherData'>{roundToOne(forecastWeather.main.feels_like)}°C</span></li>
            </ul>

            <ul className='weatherType'>
                <li>Weather: <span className='weatherData'>{(forecastWeather.weather[0].description).replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}</span></li>
                <li>Clouds: <span className='weatherData'>{forecastWeather.clouds.all}%</span></li>
            </ul>

            <ul className='atmosphere'>
                <li>Humidity: <span className='weatherData'>{forecastWeather.main.humidity}%</span></li>
                <li>Pressure: <span className='weatherData'>{forecastWeather.main.pressure} hPa</span></li>
                <li>Wind Speed: <span className='weatherData'>{forecastWeather.wind.speed} m/s</span></li>
            </ul>

            <ul className='astronomy'>
                <li>Sunrise: <span className='weatherData'>{getProperTime(weather.sys.sunrise + weather.timezone)}</span></li>
                <li>Sunset: <span className='weatherData'>{getProperTime(weather.sys.sunset + weather.timezone)}</span></li>
            </ul>
        </>
    )
}

export default WeatherComponent;