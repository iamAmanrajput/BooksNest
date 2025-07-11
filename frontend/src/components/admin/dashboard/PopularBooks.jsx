import Loader from "@/components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";

const PopularBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/book/featuredBook?limit=5`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response?.data?.success) {
          setBooks(response.data.data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-customGray">
          Popular Books
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-5">
        {loading ? (
          <Loader height={30} width={8} />
        ) : books?.length === 0 ? (
          <p className="text-center text-sm text-customGray py-6">
            No books found.
          </p>
        ) : (
          books?.map((book, index) => (
            <div
              key={book?._id}
              className="w-full flex items-center justify-between"
            >
              <div className="flex gap-3 items-center">
                <Badge variant="secondary" className="w-7 h-7 rounded-full">
                  {index + 1}
                </Badge>
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                  <AvatarImage src={book?.coverImage?.imageUrl} />
                  <AvatarFallback>
                    {book?.title
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-medium leading-none truncate">
                    {book?.title.length > 23
                      ? book?.title.slice(0, 23) + "..."
                      : book?.title}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 truncate text-customGray">
                    {book?.authors[0]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-customYellow" />{" "}
                <span className="text-customGray text-xl font-bold">
                  {book?.rating.toFixed(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PopularBooks;
