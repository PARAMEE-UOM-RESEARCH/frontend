import React, { useState, useEffect } from "react";
import { Card, Tag, Spin, Input, Button, Modal, Image, Tooltip } from "antd";
import {
  EnvironmentOutlined,
  StarOutlined,
  WifiOutlined,
  CarOutlined,
  GoogleCircleFilled,
  EyeOutlined,
  AimOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { getHighQualityImageUrl } from "../helpers/helper";
import axios from "axios";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
const { REACT_APP_BASE_URL } = process.env;

const { Search } = Input;

const HotelCard = ({
  hotel,
  onBookNow,
  profile,
  setMenuItem,
  setIsRecommendationModalVisible,
  setSelectedHotel,
}) => {
  const highQualityImageUrl = getHighQualityImageUrl(hotel.main_photo_url);

  return (
    <div className="p-4">
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
        <h3 className="text-xl font-semibold">
          {hotel.hotel_name}{" "}
          <Tooltip title={"Get AI Recommendation"}>
            <CommentOutlined
              onClick={() => {
                setSelectedHotel(hotel);
                setIsRecommendationModalVisible(true);
              }}
            />
          </Tooltip>
        </h3>
        <p className="text-gray-500">
          {hotel.city}, {hotel.countrycode.toUpperCase()}
        </p>
        <div className="flex items-center space-x-2 my-2">
          <Tag color="green">{hotel.review_score_word}</Tag>
          <Tag color="blue">{hotel.review_score}</Tag>
        </div>
        <p className="flex items-center text-yellow-500">
          <StarOutlined className="mr-2" /> Class: {hotel.class}
        </p>
        <p className="mt-2">
          <strong>Check-in:</strong> {hotel.checkin.from || "N/A"} -{" "}
          {hotel.checkin.until || "N/A"}
        </p>
        <p>
          <strong>Check-out:</strong> {hotel.checkout.from || "N/A"} -{" "}
          {hotel.checkout.until || "N/A"}
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
        <div className="mt-4 flex justify-center ">
          <Button
            type="primary"
            size="large"
            className="w-full bg-dark"
            onClick={() => {
              if (!profile) {
                onBookNow(hotel);
              } else {
                setMenuItem("5");
              }
              localStorage.setItem("hotel", JSON.stringify(hotel));
            }}
          >
            Book Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

const HotelList = ({ hotels, isLoading, profile, setMenuItem, type }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isRecommendationModalVisible, setIsRecommendationModalVisible] =
    useState(false);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState("");

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
          tokenResponse.access_token
      )
        .then((response) => response.json())
        .then((profile) => {
          console.log("User Profile:", profile);
          localStorage.setItem("profile", JSON.stringify(profile));
          setIsModalVisible(false);
          setMenuItem("5");
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    },
  });

  // Search filter handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    setFilteredHotels(
      hotels.filter((hotel) =>
        hotel.hotel_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [hotels, searchQuery]);

  const fetchRecommendation = async () => {
    try {
      setIsLoadingRecommendation(true);
      const { data } = await axios.post(
        `${REACT_APP_BASE_URL}/recommendation/`,
        {
          text: JSON.stringify(selectedHotel),
          userName: profile?.name ?? "User",
        }
      );
      setRecommendation(data);
      setIsLoadingRecommendation(false);
    } catch (error) {
      console.log("err", error);
    }
  };

  console.log("recommendation", recommendation);

  useEffect(() => {
    if (isRecommendationModalVisible) {
      fetchRecommendation();
    }
  }, [isRecommendationModalVisible]);

  // Book Now button click handler
  const handleBookNow = (hotel) => {
    setSelectedHotel(hotel);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedHotel(null);
  };

  return (
    <div>
      <Search
        placeholder="Search by hotel name"
        onChange={handleSearchChange}
        value={searchQuery}
        className="mb-4"
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.hotel_id}
                hotel={hotel}
                onBookNow={handleBookNow}
                profile={profile}
                setMenuItem={setMenuItem}
                setIsRecommendationModalVisible={
                  setIsRecommendationModalVisible
                }
                setSelectedHotel={setSelectedHotel}
              />
            ))
          ) : (
            <p className="text-center col-span-full">
              No {!type ? "hotels" : "restaurants"} found
            </p>
          )}
        </div>
      )}

      {/* Modal for booking */}
      <Modal
        title="Book Now"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {!profile && (
          <>
            {/* <HotelCard hotel={selectedHotel} /> */}
            <div className="flex justify-center mt-4">
              <Button onClick={() => login()}>
                <GoogleCircleFilled /> Sign in with Google
              </Button>
            </div>
          </>
        )}
      </Modal>
      {/* Modal for Recommendation */}
      <Modal
        title="Recommendation"
        open={isRecommendationModalVisible}
        onCancel={() => setIsRecommendationModalVisible(false)}
        footer={null}
      >
        {isLoadingRecommendation ? (
          <center>
            <Spin />
          </center>
        ) : (
          <div>
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {recommendation}
            </Markdown>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HotelList;
