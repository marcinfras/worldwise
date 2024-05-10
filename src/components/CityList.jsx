import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CityList() {
  const { isLoading, cities, error } = useCities();

  return (
    <ul className={styles.cityList}>
      {!isLoading && error && <Message message={error} />}
      {isLoading && <Spinner />}
      {!isLoading && cities.length === 0 && !error && (
        <Message
          message={"Add your first city by clicking on a city on the map"}
        />
      )}
      {!isLoading &&
        cities.map((city) => <CityItem city={city} key={city.id} />)}
    </ul>
  );
}

export default CityList;
