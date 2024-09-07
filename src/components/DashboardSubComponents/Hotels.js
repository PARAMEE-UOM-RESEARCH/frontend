import { message, Modal, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import Map from "./Map";
import HotelList from "./HotelList";
import { FilterFilled, FilterOutlined } from "@ant-design/icons";
const { REACT_APP_BASE_URL } = process.env;

const Hotels = ({ location, profile, setMenuItem, type = "" }) => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locObj, setLocObj] = useState({
    latitude: location.latitude,
    longitude: location.longitude,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adults, setAdults] = useState(1); // State for parent count
  const [children, setChildren] = useState(0); // State for children count

  const { Option } = Select;

  const fetchHotels = useCallback(async () => {
    if (!locObj.latitude || !locObj.longitude) return;

    setIsLoading(true);
    const today = new Date();
    const arrivalDate = today.toISOString().split("T")[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const departureDate = tomorrow.toISOString().split("T")[0];

    try {
      const res = await axios.get(
        `${REACT_APP_BASE_URL}/hotels/searchByCoordinates?latitude=${locObj.latitude}&longitude=${locObj.longitude}&arrival_date=${arrivalDate}&departure_date=${departureDate}&adults=${adults}&children_age=${children}&room_qty=1&units=metric&page_number=1&temperature_unit=c&languagecode=en-us&currency_code=USD`
      );
      if (type === "restaurant") {
        setHotels(
          res?.data?.data?.result?.filter(
            (el) =>
              el.hotel_name.toLowerCase().includes("resort") ||
              el.hotel_name.toLowerCase().includes("residencies")
          )
        );
      } else setHotels(res?.data?.data?.result || []);
    } catch (err) {
      console.log("Error fetching hotels", err);
      message.error("Error fetching hotels");
    } finally {
      setIsLoading(false);
    }
  }, [locObj, adults, children, type]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels, locObj]);

  const handleLocationChange = ({ lat, lng }) => {
    setLocObj({ latitude: lat, longitude: lng });
    setIsModalOpen(false);
  };

  const handleAdultsChange = (value) => {
    setAdults(value);
  };

  const handleChildrenChange = (value) => {
    setChildren(value);
  };

  return (
    <div>
      <div className="flex items-center space-x-4">
        <span className=" text-xl"> Filter by location</span>
        <FilterFilled
          className=" text-green-600 text-xl cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />

        {/* Dropdown for adults */}
        <div className="flex items-center space-x-2">
          <span>Parents:</span>
          <Select value={adults} onChange={handleAdultsChange}>
            {[...Array(50).keys()].map((num) => (
              <Option key={num + 1} value={num + 1}>
                {num + 1}
              </Option>
            ))}
          </Select>
        </div>

        {/* Dropdown for children */}
        <div className="flex items-center space-x-2">
          <span>Children:</span>
          <Select value={children} onChange={handleChildrenChange}>
            {[...Array(50).keys()].map((num) => (
              <Option key={num} value={num}>
                {num}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <HotelList
        hotels={hotels}
        isLoading={isLoading}
        profile={profile}
        setMenuItem={setMenuItem}
        type={type}
      />

      <Modal
        title={"Select your location"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Map onLocationChange={handleLocationChange} />
      </Modal>
    </div>
  );
};

export default Hotels;
