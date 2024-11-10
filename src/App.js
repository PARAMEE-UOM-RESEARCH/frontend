import { Route, Routes } from "react-router-dom";
import UserDashboard from "./components/UserDashboard";
import { useEffect, useState } from "react";
import { handleGetLocation } from "./components/helpers/helper";
import Footer from "./components/DashboardSubComponents/Footer";
import { useLocalStorageListner } from "./components/customHooks/useLocalStorageListner";
import ChatBot from "./components/DashboardSubComponents/ChatBot";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "./components/AdminDashboard";
import BackToTop from "./BackToTop";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState("");
  const profile = useLocalStorageListner("profile");

  useEffect(() => {
    handleGetLocation(setLocation, setErrorMessage);
  }, [useLocalStorageListner("profile")]);

  console.log("location", location);

  return (
    <>
      {profile && <ChatBot profile={profile} />}
      <Routes>
        <Route path="/" element={<UserDashboard location={location} />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard location={location} />
            </PrivateRoute>
          }
        />
      </Routes>
      <BackToTop />
      <Footer />
    </>
  );
}

export default App;
