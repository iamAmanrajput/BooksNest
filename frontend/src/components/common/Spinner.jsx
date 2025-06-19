import React from "react";
import { BeatLoader } from "react-spinners";

const Spinner = ({ size = 15, color = "#a4a4a4" }) => {
  return <BeatLoader size={size} color={color} />;
};

export default Spinner;
