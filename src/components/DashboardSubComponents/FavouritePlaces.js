import {
  CarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  StarOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { Button, Card, Image, message, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useLocalStorageListner } from "../customHooks/useLocalStorageListner";
import axios from "axios";
import { getHighQualityImageUrl } from "../helpers/helper";
const { REACT_APP_BASE_URL } = process.env;

const FavouriteCard = ({ hotel, profile }) => {
  const highQualityImageUrl = getHighQualityImageUrl(
    hotel?.main_photo_url ?? ""
  );
  const _id = useLocalStorageListner("fav")?.find(
    (fav) => fav.hotel.hotel_id === hotel.hotel_id
  )?._id;

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
        {hotel.composite_price_breakdown.discounted_amount?.value.toFixed(2)
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
  );
};
const FavouritePlaces = ({ profile }) => {
  const fetchAPI = async () => {
    const { data } = await axios.get(
      `${REACT_APP_BASE_URL}/get-fav/${profile.id}`
    );
    localStorage.setItem("fav", JSON.stringify(data));
  };
  const fav = useLocalStorageListner("fav");
  useEffect(() => {
    fetchAPI();
  }, []);
  return (
    <div>
      {!fav?.length ? (
        <center>You don't have any added favourites.</center>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fav?.map((fav) => (
            <div>
              <FavouriteCard hotel={fav.hotel} profile={profile} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritePlaces;
