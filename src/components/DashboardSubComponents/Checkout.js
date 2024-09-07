import React, { useState } from "react";
import { useLocalStorageListner } from "../customHooks/useLocalStorageListner";
import { Button, Card, Image, message, Tag } from "antd";
import {
  CarOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  WifiOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { getHighQualityImageUrl } from "../helpers/helper";
import Map from "./Map";
import { PaymentModal } from "./PaymentModal";
import axios from "axios";
const { REACT_APP_BASE_URL } = process.env;

export const Checkout = ({ menuItem, profile }) => {
  const hotel = useLocalStorageListner("hotel");
  const highQualityImageUrl = getHighQualityImageUrl(
    hotel?.main_photo_url ?? ""
  );
  const _id = useLocalStorageListner("fav")?.find(
    (fav) => fav.hotel.hotel_id === hotel.hotel_id
  )?._id;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(
    useLocalStorageListner("fav")?.some(
      (fav) => fav.hotel.hotel_id === hotel.hotel_id
    )
  );

  const handleFavoriteClick = async (hotel) => {
    try {
      if (!isFavorite) {
        await axios.post(`${REACT_APP_BASE_URL}/add-to-fav/${profile.id}`, {
          hotel: JSON.stringify(hotel),
        });
        message.success("Hotel added to your favourites");
      } else {
        await axios.delete(`${REACT_APP_BASE_URL}/delete-fav/${_id["$oid"]}`);
        message.success("Hotel removed from your favourites");
      }
      const { data } = await axios.get(
        `${REACT_APP_BASE_URL}/get-fav/${profile.id}`
      );
      localStorage.setItem("fav", JSON.stringify(data));
      setIsFavorite(!isFavorite);
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <div>
      <div className="p-4 flex justify-evenly">
        {hotel ? (
          <>
            <Card
              hoverable
              cover={
                <Image
                  alt={hotel.hotel_name}
                  src={highQualityImageUrl}
                  className="rounded-lg h-48 object-cover"
                />
              }
              className="shadow-lg border-none rounded-lg"
            >
              <h3 className="text-xl font-semibold">{hotel.hotel_name}</h3>
              <p className="text-gray-500">
                {hotel.city}, {hotel.countrycode?.toUpperCase()}
              </p>
              <div className="flex items-center space-x-2 my-2">
                <Tag color="green">{hotel.review_score_word}</Tag>
                <Tag color="blue">{hotel.review_score}</Tag>
              </div>
              <p className="flex items-center text-yellow-500">
                <StarOutlined className="mr-2" /> Class: {hotel.class}
              </p>
              <p className="mt-2">
                <strong>Check-in:</strong> {hotel.checkin?.from || "N/A"} -{" "}
                {hotel.checkin?.until || "N/A"}
              </p>
              <p>
                <strong>Check-out:</strong> {hotel.checkout?.from || "N/A"} -{" "}
                {hotel.checkout?.until || "N/A"}
              </p>
              <p className="mt-2">
                <strong>Price per night:</strong> $
                {hotel.composite_price_breakdown.gross_amount.value.toFixed(2)}
              </p>
              <p>
                <strong>Mobile Discount:</strong>{" "}
                {hotel.composite_price_breakdown.discounted_amount?.value.toFixed(
                  2
                )
                  ? `$${hotel.composite_price_breakdown.discounted_amount?.value.toFixed(
                      2
                    )}`
                  : "N/A"}
              </p>
              <div className="mt-4 space-x-2">
                {hotel.has_free_parking && (
                  <Tag icon={<CarOutlined />} color="green">
                    Free Parking
                  </Tag>
                )}
                {hotel.has_swimming_pool && (
                  <Tag icon={<WifiOutlined />} color="blue">
                    Pool
                  </Tag>
                )}
              </div>
              <p className="mt-4 text-gray-600">
                <EnvironmentOutlined className="mr-2" /> {hotel.city_in_trans}
              </p>

              {/* Add to Favorite Button */}
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => handleFavoriteClick(hotel)}
                  className={`flex items-center ${
                    isFavorite ? "bg-red-500" : "bg-gray-300"
                  } text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out`}
                  icon={<HeartOutlined className="mr-2" />}
                >
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              </div>
            </Card>

            <Map hotel={hotel} menuItem={menuItem} />
            <PaymentModal
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
            />
          </>
        ) : (
          <center>No checkout found</center>
        )}
      </div>

      <center>
        <Button
          onClick={() => setIsModalVisible(true)}
          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          icon={<ShoppingCartOutlined className="mr-2" />}
        >
          Proceed to Checkout
        </Button>
      </center>
    </div>
  );
};
