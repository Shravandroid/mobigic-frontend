import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import RegisterUser from "./Components/RegisterUser";
import { Profile } from "./Components/Profile";
import { useEffect, createContext, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";

interface AppContextType {
  token: undefined | string;
  setToken: React.Dispatch<React.SetStateAction<string|undefined>>;
}

export const AppContext = createContext<AppContextType>({
  token: undefined,
  setToken: () => {},
});

export const App = () => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      const sToken:string = sessionStorage.getItem("token") || '';
      setToken(sToken);
      navigate('/profile')
    }
  }, [token]);
  return (
    <AppContext.Provider value={{ token, setToken }}>
      <div className="site-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="register" replace />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterUser />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AppContext.Provider>
  );
};

export default App;
