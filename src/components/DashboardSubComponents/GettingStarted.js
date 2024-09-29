import React from "react";

const GettingStarted = ({ handleFocus }) => {
  return (
    <div
      className="relative w-full h-[30rem] bg-cover bg-center rounded-md"
      style={{
        backgroundImage:
          "url(https://i.ibb.co/6s4q0jP/kevin-delvecchio-7no-ZJ-4nh-U8-unsplash.jpg)",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to VacationWay.com
        </h1>
        <p className="text-lg text-white mb-6">
          The ultimate hotel management system designed to streamline your
          operations. From booking management to guest services, VacationWay.com
          simplifies every aspect of running a hotel with power of AI.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded shadow-lg hover:bg-blue-600 transition duration-300"
          onClick={handleFocus}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default GettingStarted;
