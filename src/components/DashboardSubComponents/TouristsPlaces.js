import { Button, Input, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const TouristsPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": "AIzaSyBFBLhrwTqyTFBShdwvKGpNc3ngo-OvehU",
    "X-Goog-FieldMask": "*",
  };

  const fetchTouristsPlaces = async () => {
    try {
      setIsPlacesLoading(true);
      const requestBody = {
        textQuery: "Most attractive tourist places in Sri Lanka",
      };

      let nextPageToken = null;

      const { data } = await axios.post(
        `https://places.googleapis.com/v1/places:searchText`,
        {
          ...requestBody,
          pageToken: nextPageToken, // Include pageToken for subsequent requests
        },
        { headers }
      );

      setPlaces(data.places); // Set the fetched unique places
      setFilteredPlaces(data.places); // Initialize filteredPlaces
      setIsPlacesLoading(false);
    } catch (error) {
      console.log("err", error);
      setIsPlacesLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsPlacesLoading(true);
    const { data } = await axios.post(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        textQuery:
          "Most attractive tourist places in Sri Lanka in " + searchQuery,
        pageToken: null, // Include pageToken for subsequent requests
      },
      { headers }
    );

    // Filter places based on the search query
    const filtered = data.places.filter((place) =>
      place.displayName.text
        .toLowerCase()
        .includes(searchQuery.toLocaleLowerCase())
    );
    setFilteredPlaces(filtered);
    setIsPlacesLoading(false);
  };

  useEffect(() => {
    fetchTouristsPlaces();
  }, []);

  // Utility function to return "N/A" for null or undefined values
  const getValueOrNA = (value) => (value ? value : "N/A");

  return (
    <Spin spinning={isPlacesLoading}>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Tourism Places</h2>

        {/* Search Input */}
        <div className=" flex flex-row justify-evenly">
          <Input
            placeholder="Search for tourist places"
            value={searchQuery}
            className="mb-6 w-5/6"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.length === 0 ? (
            <center>
              <div className="text-center text-gray-600">No results found.</div>
            </center>
          ) : (
            filteredPlaces
              .filter((place) => place.displayName.text !== "Sri Lanka")
              .map((place) => (
                <div
                  key={place.id}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {getValueOrNA(place.displayName.text)} -{" "}
                    {getValueOrNA(place?.primaryTypeDisplayName?.text)}
                  </h3>
                  <h5 className="text-gray-700 mb-3">
                    {getValueOrNA(place.editorialSummary?.text)}
                  </h5>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Phone: {getValueOrNA(place.nationalPhoneNumber)}</p>
                    <p>Address: {getValueOrNA(place.formattedAddress)}</p>
                  </div>

                  {/* Rating Section */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span className="font-semibold mr-2">Rating:</span>
                    {place.userRatingCount > 0 ? (
                      <>
                        <span>{place.userRatingCount} ratings</span>
                        <span className="ml-2">•</span>
                        <span className="ml-2">
                          {getValueOrNA(place.rating)}
                        </span>
                      </>
                    ) : (
                      <span>No ratings available</span>
                    )}
                  </div>

                  {/* Reviews Section */}
                  {place?.reviews?.slice(0, 2).map((review, index) => (
                    <p
                      key={index}
                      className="italic text-sm text-gray-600 mb-2"
                    >
                      "{getValueOrNA(review.originalText?.text)}"
                    </p>
                  ))}

                  {getValueOrNA(place.websiteUri) === "N/A" ? (
                    <></>
                  ) : (
                    <p className="text-sm text-blue-500 hover:underline">
                      <span className="font-semibold">Website: </span>
                      <a
                        href={getValueOrNA(place.websiteUri)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getValueOrNA(place.websiteUri)}
                      </a>
                    </p>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </Spin>
  );
};

export default TouristsPlaces;
