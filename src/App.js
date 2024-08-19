import { Route, Routes } from "react-router-dom";
import UserDashboard from "./components/UserDashboard";
import { useEffect, useState } from "react";
import { message } from "antd";
import { handleGetLocation } from "./components/helpers/helper";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    handleGetLocation(setLocation, setErrorMessage);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<UserDashboard location={location} />} />
    </Routes>
  );
}

export default App;
