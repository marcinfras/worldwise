import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUrlPosition from "../hooks/useUrlPosition";
import { useCities } from "../contexts/CitiesContext";
import Button from "./Button";
import { useGeolocation } from "../hooks/useGeolocation";

function Map() {
  const { cities, c } = useCities();
  const {
    getLocation,
    isLoading: geolocationIsLoading,
    position: geolocationPosition,
  } = useGeolocation();

  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [lat, lng] = useUrlPosition();

  useEffect(() => {
    if (lat && lng) setMapPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    // console.log("dasdas");
    // if (lat || lng) return;
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  // console.log(positionTest);
  // const position = [51.505, -0.09];

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getLocation}>
        {geolocationIsLoading ? "Loading..." : "Use your position"}
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnClick />
        <ChangeView center={mapPosition} />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              {city.emoji} {city.cityName}
            </Popup>
          </Marker>
        ))}
        {/* <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
      </MapContainer>
    </div>
  );
}

function ChangeView({ center }) {
  const map = useMap();

  map.setView(center);

  return null;
}

function SetViewOnClick() {
  const navigate = useNavigate();

  const map = useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;
    map.setView(e.latlng);
    navigate(`form?lat=${lat}&lng=${lng}`);
  });

  return null;
}

export default Map;
