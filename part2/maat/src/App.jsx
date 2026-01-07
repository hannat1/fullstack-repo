import { useState, useEffect } from "react"
import axios from "axios"

const App = () => {
  const [value, setValue] = useState("")
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
  const weather_apikey = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (value === "") {
      setCountries([])
    } else {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then((response) => {
          const countries = response.data.filter((country) =>
            country.name.common.toLowerCase().includes(value.toLowerCase())
          )
          setCountries(countries)
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
  }, [value])

  useEffect(() => {
    if (countries.length === 1) {
      const capital = countries[0].capital[0]
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${weather_apikey}&units=metric`
        )
        .then((response) => {
          setWeather(response.data)
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
  }, [countries])

  return (
    <div>
      find countries{" "}
      <input value={value} onChange={(event) => setValue(event.target.value)} />
      <p>
        {countries.length > 10 && "Too many matches, specify another filter"}
      </p>
      {countries.length > 1 && countries.length <= 10 && (
        <div>
          {countries.map((c) => (
            <div key={c.name.common}>
              <p>
                {c.name.common}
                <button onClick={() => setCountries([c])}>show</button>
              </p>
            </div>
          ))}
        </div>
      )}
      {countries.length === 1 && (
        <div>
          <h1>{countries[0].name.common}</h1>
          <p>Capital {countries[0].capital}</p>
          <p>Area {countries[0].area}</p>
          <h2>Languages</h2>
          {countries[0].languages && (
            <ul>
              {Object.values(countries[0].languages).map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
          )}
          <img
            src={countries[0].flags.png}
            alt={`Flag of ${countries[0].name.common}`}
            width="200"
          />
          <h2>Weather in {countries[0].capital}</h2>
          <p>Temperature {weather?.main?.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`}
            alt="weather icon"
            width="100"
          />
          <p>Wind {weather?.wind?.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default App
