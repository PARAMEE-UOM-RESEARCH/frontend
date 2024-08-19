import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Map from "./Map";
const { REACT_APP_BASE_URL } = process.env;

const Hotels = ({ location }) => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `${REACT_APP_BASE_URL}/hotels/searchByCoordinates?latitude=${
            location.latitude
          }&longitude=${
            location.longitude
          }&arrival_date=2024-08-19&departure_date=2024-08-20&adults=${1}&children_age=${0}&room_qty=${1}&units=metric&page_number=1&temperature_unit=c&languagecode=en-us&currency_code=USD`
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
