import { Route, Routes } from "react-router-dom";
import UserDashboard from "./components/UserDashboard";
import { useEffect, useState } from "react";
import { handleGetLocation } from "./components/helpers/helper";
import Footer from "./components/DashboardSubComponents/Footer";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    handleGetLocation(setLocation, setErrorMessage);
  }, []);

  console.log("location", location)

  return (
    <>
      <Routes>
        <Route path="/" element={<UserDashboard location={location} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
