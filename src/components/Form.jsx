import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import useUrlPosition from "../hooks/useUrlPosition";
import ButtonBack from "./ButtonBack";
import Button from "./Button";
import Spinner from "./Spinner";
import Message from "./Message";

import styles from "./Form.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useUrlPosition();
  const navigate = useNavigate();

  const { addCity, isLoading } = useCities();

  const [isLoadingCityName, setIsLoadingCityName] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");

  // "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

  useEffect(() => {
    if (!lat && !lng) return;

    setIsLoadingCityName(true);

    const fetchCityData = async () => {
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );

        if (!res.ok) throw new Error("Failed to fetch city data");

        const data = await res.json();

        console.log(data);

        setCityName(data.city);
        setEmoji(convertToEmoji(data.countryCode));
        setCountry(data.countryName);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoadingCityName(false);
      }
    };

    fetchCityData();
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cityName && !date) return;

    const cityData = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };

    await addCity(cityData);

    navigate("/app/cities");
  };

  if (isLoadingCityName) return <Spinner />;

  if (!isLoadingCityName && !cityName)
    return (
      <Message
        message={" That doesn't seem to be a city. Click somewhere else 😉"}
      />
    );

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
