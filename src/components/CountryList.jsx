import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";
import Message from "./Message";
import Spinner from "./Spinner";

function CountryList() {
  const { cities } = useCities();

  const countries = cities.reduce((arr, cur) => {
    if (arr.map((city) => city.country).includes(cur.country)) return arr;
    else return [...arr, { country: cur.country, emoji: cur.emoji }];
  }, []);

  if (cities.length === 0)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map"}
      />
    );

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
