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

export const genreData = {
  trigger: "Genre",
  items: [
    // Fiction
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Thriller",
    "Horror",
    "Romance",
    "Historical Fiction",
    "Adventure",
    "Drama",
    "Dystopian",
    "Young Adult",
    "Children",
    "Graphic Novel",
    "Mythology",
    "Satire",
    "Short Stories",

    // Non-Fiction
    "Biography",
    "Autobiography",
    "Memoir",
    "History",
    "Science",
    "Self-Help",
    "Psychology",
    "Philosophy",
    "Religion",
    "Politics",
    "Business",
    "Economics",
    "Technology",
    "Education",
    "Travel",
    "Health",
    "Art",
    "Photography",
    "Law",
    "Cooking",
    "Parenting",
    "Language",

    // Academic
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Engineering",
    "Medical",
    "Environmental Studies",
    "Sociology",
    "Anthropology",
    "Literature",
    "Statistics",
    "Civics",
    "Geography",
    "Accountancy",
    "Commerce",
  ],
};

export const languageData = {
  trigger: "Language",
  items: ["English", "Hindi", "French", "Spanish", "German"],
};

// get pagination range for pagination
export const getPaginationRange = (currentPage, totalPages) => {
  const range = [];

  // Always show first page
  if (currentPage > 2) {
    range.push(1);
    if (currentPage > 3) range.push("start-ellipsis");
  }

  // Always show current page
  if (currentPage > 1) range.push(currentPage - 1);
  range.push(currentPage);
  if (currentPage < totalPages) range.push(currentPage + 1);

  // Always show last page
  if (currentPage < totalPages - 1) {
    if (currentPage < totalPages - 2) range.push("end-ellipsis");
    range.push(totalPages);
  }

  return range;
};
