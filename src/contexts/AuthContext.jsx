import { createContext, useContext, useReducer } from "react";

const initialState = {
  isAuth: false,
  user: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "auth/login":
      return {
        ...state,
        isAuth: true,
        user: action.payload,
      };
    case "auth/logout":
      return {
        ...initialState,
      };
    default:
      return { ...state };
  }
};

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [{ isAuth, user }, dispatch] = useReducer(reducer, initialState);

  const login = (email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "auth/login", payload: FAKE_USER });
  };

  const logout = () => {
    dispatch({ type: "auth/logout" });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export default AuthProvider;
