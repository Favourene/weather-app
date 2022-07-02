import React, { useState, useEffect } from 'react'
import './App.css'
import Atmosphere from './image/atmosphere.png'
import Clear from './image/clear.png'
import Cloud from './image/cloud.png'
import Drizzle from './image/drizzle.png'
import Rain from './image/rain.png'
import Snow from './image/snow.png'
import Thunderstorm from './image/thunderstorm.png'

const daysArray = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function App() {
  const [city, setCity] = useState('')
  const [arrayOfDays, setArrayOfDays] = useState([
    {
      dt_txt: '0000-00-00 00:00:00',
      main: {
        temp_max: 0,
        temp_min: 0,
      },
      weather: [
        {
          id: 0,
        },
      ],
    },
  ])
  const [weatherData, setWeatherData] = useState({
    city: {
      name: 'select city',
    },
  })
  const [mainData, setMainData] = useState({
    main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0,
    },
    weather: [
      {
        description: 'select city',
        id: 804,
        main: 'Clear',
      },
    ],
  })
  const [todayHours, setTodayHours] = useState([
    {
      dt_txt: '0000-00-00 00:00:00',
      main: {
        temp: 25.04,
      },
      weather: [
        {
          id: 0,
        },
      ],
    },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //Gets permission from user to get their location (longitude & latide) from thier gps
    function getLocation() {
      if (navigator.geolocation) {
        //The if statements checks if the user is on a device that has gps, and if the permission is granted, it runs the weather api using thier location.
        navigator.geolocation.getCurrentPosition((data) => {
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coords.latitude}&lon=${data.coords.longitude}&cnt=40&appid=32ba0bfed592484379e51106cef3f204&units=metric`
          )
            .then((response) => response.json())
            .then((data) => {
              setWeatherData(data)
              const groupedData = data.list.reduce((days, row) => {
                const date = row.dt_txt.split(' ')[0]
                days[date] = [...(days[date] ? days[date] : []), row]
                setLoading(false)
                return days
              }, {})
              setArrayOfDays(Object.values(groupedData))
              setTodayHours(Object.values(groupedData)[0])
              setMainData(Object.values(groupedData)[0][0])
            })
        }, console.log)
      } else {
        //if the user is on a device that is not gps enabeled it returns this
        console.log('Geolocation is not supported by this browser.')
      }
    }
    getLocation()
  }, [])

  const handleSubmit = (event) => {
    //this collects the city selected by the user and fetches the data
    event.preventDefault()
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=40&appid=32ba0bfed592484379e51106cef3f204&units=imperial`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data)
        const groupedData = data.list.reduce((days, row) => {
          //since the api is returning multiple list data, this groups all the data that has similar dates.
          const date = row.dt_txt.split(' ')[0]
          days[date] = [...(days[date] ? days[date] : []), row]
          setLoading(false)
          return days
        }, {})
        setArrayOfDays(Object.values(groupedData))
        setTodayHours(Object.values(groupedData)[0])
        setMainData(Object.values(groupedData)[0][0])
      })
  }
  return (
    <div className='App'>
      <div className='wrapper'>
        <div className='wrapper_left'>
          <h1>5 Days weather forecast</h1>
          <p>Please select a city</p>
          <div>
            <form onSubmit={handleSubmit}>
              <select
                value={city}
                id=''
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value=''>select a city</option>
                <option value='Abuja'>Abuja</option>
                <option value='Lagos'>Lagos</option>
                <option value='London'>London</option>
                <option value='Los Angeles'>Los Angeles</option>
                <option value='Paris'>Paris</option>
              </select>
              <div className='button'>
                <button>Submit</button>
              </div>
            </form>
          </div>
        </div>
        <div className='wrapper_right'>
          <div className={`weather-card ${mainData.weather[0].main}`}>
            <div className='top'>
              <h2 className='city'>{weatherData.city.name}</h2>
              <h1 className='degree'>
                {mainData.main.temp.toFixed(1)}
                <span>&#176;</span>
              </h1>
              <p className='weather'>{mainData.weather[0].description}</p>
              <p className='celcius'>
                {' '}
                {mainData.main.temp_min.toFixed(1)}/{' '}
                {mainData.main.temp_max.toFixed(1)}&#176;
              </p>
            </div>
            <div className='middle'>
              <h2>Hourly forecast</h2>
              <div className='midle_wrap'>
                {todayHours.map((item) => (
                  <div className='middle_card' key={item.dt_txt}>
                    <p className='time'>
                      {item.dt_txt.split(' ')[1].slice(0, 5)}
                    </p>
                    {/* {A check is done here to return the images, since each weather type possesses a unique code, a check is done to find which code is being passed and the image relating to that code is returned} */}
                    {item.weather[0].id === 0 && <img src={Clear} alt='' />}
                    {item.weather[0].id >= 200 && item.weather[0].id <= 299 && (
                      <img src={Thunderstorm} alt='' />
                    )}
                    {item.weather[0].id >= 300 && item.weather[0].id <= 399 && (
                      <img src={Drizzle} alt='' />
                    )}
                    {item.weather[0].id >= 500 && item.weather[0].id <= 599 && (
                      <img src={Rain} alt='' />
                    )}
                    {item.weather[0].id >= 600 && item.weather[0].id <= 699 && (
                      <img src={Snow} alt='' />
                    )}
                    {item.weather[0].id >= 700 && item.weather[0].id <= 799 && (
                      <img src={Atmosphere} alt='' />
                    )}
                    {item.weather[0].id === 800 && <img src={Clear} alt='' />}
                    {item.weather[0].id >= 801 && item.weather[0].id <= 899 && (
                      <img src={Cloud} alt='' />
                    )}
                    <p>{item.main.temp.toFixed(1)}&#176;</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='bottom'>
              <h2>Daily forecast</h2>
              {loading ? (
                <div className='bottom_wrap'>
                  <div className='bottom_card'>
                    <h3>0000</h3>
                    <p>Day</p>
                    <img src={Clear} alt='' />
                    <p>0/0&#176;</p>
                  </div>
                </div>
              ) : (
                <div className='bottom_wrap'>
                  {arrayOfDays.slice(0, 5).map((item) => (
                    <div className='bottom_card' key={item[0].dt_txt}>
                      <h3>{item[0].dt_txt.slice(0, 10)}</h3>
                      <p>
                        {
                          daysArray[
                            new Date(item[0].dt_txt.slice(0, 10)).getDay()
                          ]
                        }
                      </p>
                      {item[0].weather[0].id >= 200 &&
                        item[0].weather[0].id <= 299 && (
                          <img src={Thunderstorm} alt='' />
                        )}
                      {item[0].weather[0].id >= 300 &&
                        item[0].weather[0].id <= 399 && (
                          <img src={Drizzle} alt='' />
                        )}
                      {item[0].weather[0].id >= 500 &&
                        item[0].weather[0].id <= 599 && (
                          <img src={Rain} alt='' />
                        )}
                      {item[0].weather[0].id >= 600 &&
                        item[0].weather[0].id <= 699 && (
                          <img src={Snow} alt='' />
                        )}
                      {item[0].weather[0].id >= 700 &&
                        item[0].weather[0].id <= 799 && (
                          <img src={Atmosphere} alt='' />
                        )}
                      {item[0].weather[0].id === 800 && (
                        <img src={Clear} alt='' />
                      )}
                      {item[0].weather[0].id >= 801 &&
                        item[0].weather[0].id <= 899 && (
                          <img src={Cloud} alt='' />
                        )}
                      <p>
                        {' '}
                        {item[0].main.temp_min.toFixed(1)}/{' '}
                        {item[0].main.temp_max.toFixed(1)}&#176;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
