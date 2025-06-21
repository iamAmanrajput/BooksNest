import { Star, StarHalf } from "lucide-react";
import { Colors } from "./colors";

//code to generate star on the basis of rating
export const starGenerator = (
  rating,
  stroke = "0",
  size,
  fill = Colors.customYellow
) => {
  return Array.from({ length: 5 }, (element, index) => {
    const number = index + 0.5;
    return (
      <span key={index}>
        {rating >= index + 1 ? (
          <Star fill={fill} stroke={stroke} size={size} />
        ) : rating >= number ? (
          <StarHalf fill={fill} stroke={stroke} size={size} />
        ) : (
          <Star stroke={Colors.customYellow} size={size} />
        )}
      </span>
    );
  });
};

export function formatDateTime(isoString) {
  const dateObj = new Date(isoString);

  const optionsDate = { day: "2-digit", month: "2-digit", year: "numeric" };
  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };

  const date = dateObj.toLocaleDateString("en-IN", optionsDate);
  const time = dateObj.toLocaleTimeString("en-IN", optionsTime);

  return { date, time };
}
