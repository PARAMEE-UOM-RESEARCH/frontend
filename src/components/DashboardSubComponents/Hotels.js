import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Map from "./Map";
const { REACT_APP_BASE_URL } = process.env;

const Hotels = ({ location }) => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    (async () => {
      const today = new Date();
      const arrivalDate = today.toISOString().split("T")[0];

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const departureDate = tomorrow.toISOString().split("T")[0];
      await axios
        .get(
          `${REACT_APP_BASE_URL}/hotels/searchByCoordinates?latitude=${
            location.latitude
          }&longitude=${
            location.longitude
          }&arrival_date=${arrivalDate}&departure_date=${departureDate}&adults=${1}&children_age=${0}&room_qty=${1}&units=metric&page_number=1&temperature_unit=c&languagecode=en-us&currency_code=USD`
        )
        .then((res) => setHotels(res?.data?.data?.result))
        .catch((err) => message(err));
    })();
  }, []);

  console.log("Hotels", hotels);
  localStorage.setItem("dummyHotels", JSON.stringify(hotels));

  return (
    <div>
      <Map />
    </div>
  );
};

export default Hotels;
