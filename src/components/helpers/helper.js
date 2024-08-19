import {
  CoffeeOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { message } from "antd";

export const handleGetLocation = (setLocation, setErrorMessage) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setErrorMessage("");
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage("User denied the request for Geolocation.");
            message.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("Location information is unavailable.");
            message.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setErrorMessage("The request to get user location timed out.");
            message.error("The request to get user location timed out.");
            break;
          default:
            setErrorMessage("An unknown error occurred.");
            message.error("An unknown error occurred.");
            break;
        }
      }
    );
  } else {
    setErrorMessage("Geolocation is not supported by this browser.");
    message.error("Geolocation is not supported by this browser.");
  }
};

export const navItems = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: "Dashboard",
  },
  {
    key: "2",
    icon: <HomeOutlined />,
    label: "View Hotels",
  },
  {
    key: "3",
    icon: <CoffeeOutlined />,
    label: "View Restaurants",
  },
  {
    key: "4",
    icon: <HeartOutlined />,
    label: "Favourite Places",
  },
  {
    key: "5",
    icon: <EnvironmentOutlined />,
    label: "Map",
  },
];

export const tinySliderSettings = {
  items: 1,
  slideBy: "page",
  autoplay: true,
  controls: false,
  nav: false,
  speed: 500,
  loop: true,
  mouseDrag: true,
  lazyload: true,
  gutter: 10,
};

export const tinySliderSlides = [
  {
    image: "https://i.ibb.co/Sr1hjW0/Hospitality-Professional-At-Work-web.webp",
    caption: "Hospitality Professional at Work",
  },
  {
    image: "https://i.ibb.co/hfsF58k/Hotel-Management-Career.jpg",
    caption: "Hotel Management Career",
  },
  {
    image: "https://i.ibb.co/SBDjj8L/avi-werde-h-Hz4yrvxwl-A-unsplash.jpg",
    caption: "A Scenic View from the Top",
  },
  {
    image: "https://i.ibb.co/nb8MwHg/andrew-barlow-DO-t-Vq-Gv-Dyk-unsplash.jpg",
    caption: "Tranquil Lake with Mountains",
  },
  {
    image: "https://i.ibb.co/hWJpW5L/Things-to-do-in-Sigiriya-2.jpg",
    caption: "Exploring Sigiriya",
  },
];
