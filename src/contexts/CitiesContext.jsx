import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const API_URL = "http://localhost:9000/cities";

const initialState = {
  isLoading: false,
  cities: [],
  currentCity: {},
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "cities/currentCity":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "cities/deleteCity":
      const newCities = state.cities.filter(
        (city) => city.id !== action.payload
      );
      return {
        ...state,
        isLoading: false,
        cities: newCities,
        currentCity: {},
      };
    case "cities/addCity":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/error": {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};

const CitiesContext = createContext();

const CitiesProvider = ({ children }) => {
  const [{ isLoading, cities, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Failed to fetch cities");

        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "cities/error", payload: error.message });
      }
    };
    fetchCities();
  }, []);

  const fetchCity = useCallback(
    async (id) => {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${API_URL}/${id}`);

        if (!res.ok) throw new Error("Failet to fetch city");

        const data = await res.json();

        dispatch({ type: "cities/currentCity", payload: data });
      } catch (error) {
        console.error(error.message);
      }
    },
    [currentCity.id]
  );

  const deleteCity = async (id) => {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      console.log(data);

      dispatch({ type: "cities/deleteCity", payload: id });
    } catch (error) {
      console.error(error.message);
    }
  };

  const addCity = async (cityData) => {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cityData),
      });

      const data = await res.json();

      dispatch({ type: "cities/addCity", payload: data });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        isLoading,
        cities,
        currentCity,
        error,
        fetchCity,
        deleteCity,
        addCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

export const useCities = () => {
  const context = useContext(CitiesContext);
  return context;
};

export default CitiesProvider;
