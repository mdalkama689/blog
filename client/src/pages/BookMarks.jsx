import React, { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axisoInstance from "../api/axiosInstance";
import { FaBookmark } from "react-icons/fa6";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import HomeLayout from "../components/HomeLayout";

const BookMarks = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({});
  const [bookmarkPosts, setBookmarkPosts] = useState([]);

  const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleDate = (value) => {
    const date = new Date(value);
    const getYear = date.getFullYear();
    const getMonth = shortMonths[date.getMonth()];
    const getDate = date.getDate();
    const formattedDate = `${getDate} ${getMonth} ${getYear}`;
    return formattedDate;
  };

  const handlePost = (bookmarkPost) => {
    navigate(`/post/${bookmarkPost._id}`);
  };

  useEffect(() => {
    getUserDetails();
    getBookmarkPosts();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axisoInstance.get("/user/me");
      setUserDetails(response?.data?.user);
    } catch (error) {
      return console.log("error : ", error);
    }
  };

  const getBookmarkPosts = async () => {
    try {
      const response = await axisoInstance.get("/post/bookmark");
      setBookmarkPosts(response?.data?.bookmarks);
    } catch (error) {
      return console.log("error : ", error);
    }
  };

  return (
    <HomeLayout>
      <h1 className="mt-20 text-center my-5 underline text-3xl font-bold text-gray-800">
        Your All Bookmark Posts
      </h1>

      {bookmarkPosts.length > 0 ? (
        bookmarkPosts?.map((bookmarkPost) => (
          <div
            onClick={() => handlePost(bookmarkPost)}
            key={bookmarkPost?._id}
            className="flex w-full cursor-pointer my-1 transition duration-300  bg-white py-3 hover:bg-gray-200  rounded-lg overflow-hidden"
          >
            <div className="flex-1 ">
              <div className="px-6 py-4">
                <div className=" flex items-center gap-2">
                  <img
                    className=" h-12 w-12 rounded-full border border-black"
                    src={
                      bookmarkPost?.postOwner?.profilePic?.secure_url
                        ? bookmarkPost?.postOwner?.profilePic?.secure_url
                        : "https://tse4.mm.bing.net/th?id=OIP.GeEEvvh1bNc8fdvZsq4gQwHaHa&pid=Api&P=0&h=180"
                    }
                    alt="auther-profile"
                  />
                  <p className=" text-black text-xl">
                    {bookmarkPost?.postOwner?.username}{" "}
                  </p>
                </div>
                <h2 className="text-3xl text-start mt-3 font-bold text-gray-800">
                  {bookmarkPost?.title.split(" ").slice(0, 15).join(" ")}
                </h2>
                <p className="text-gray-700 text-xl font-semibold mt-2">
                  {bookmarkPost?.contentText.split(" ").slice(0, 50).join(" ")}
                </p>
              </div>
              <div className="px-6 py-4 flex items-center justify-between">
                <div className=" flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    {bookmarkPost?.likes?.includes(userDetails?._id) ? (
                      <BiSolidLike size={40} />
                    ) : (
                      <BiLike size={40} />
                    )}
                    <p className="text-4xl font-semibold">
                      {bookmarkPost?.likes?.length}
                    </p>
                  </div>
                  {userDetails?.bookmarks?.includes(bookmarkPost?._id) ? (
                    <FaBookmark size={40} />
                  ) : (
                    <CiBookmark size={40} />
                  )}
                </div>
                <p className=" text-black font-semibold text-base">
                  {handleDate(bookmarkPost?.createdAt)}{" "}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/3">
              <img
                src={bookmarkPost?.contentImage?.secure_url}
                className="w-full h-[300px] object-cover rounded"
                alt="post-image"
              />
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-screen text-center">
          <p className="text-3xl font-medium text-gray-600">
            You don’t have any bookmarked posts yet.
          </p>
        </div>
      )}
    </HomeLayout>
  );
};

export default BookMarks;
