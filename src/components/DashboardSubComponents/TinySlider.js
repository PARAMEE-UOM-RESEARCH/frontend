import React, { forwardRef } from "react";
import TinySlider from "tiny-slider-react";
import "tiny-slider/dist/tiny-slider.css";
import { tinySliderSettings, tinySliderSlides } from "../helpers/helper";

const TinySliderComponent = forwardRef((props, ref) => {
  return (
    <div className="w-4/5 mx-auto pt-8" ref={ref}>
      <div className="text-center mb-6">
        <h2
          className="text-2xl font-bold mb-2 text-[#650D26]"
          style={{ fontFamily: "Montserrat Alternates" }}
        >
          Explore Our Gallery
        </h2>
        <p className="text-lg text-gray-700">
          Browse through our selection of stunning images. Use the drag or swipe to view different slides. Click on any image to get
          more details.
        </p>
      </div>
      <TinySlider settings={tinySliderSettings}>
        {tinySliderSlides.map((slide, index) => (
          <div
            key={index}
            className="relative h-[30rem] bg-cover"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div
              className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-10 text-center text-xl"
              style={{ fontFamily: "Montserrat Alternates" }}
            >
              {slide.caption}
            </div>
          </div>
        ))}
      </TinySlider>
    </div>
  );
});

export default TinySliderComponent;
