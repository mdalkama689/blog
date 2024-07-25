import React, { useState, useEffect } from "react";
import HomeLayout from "../components/HomeLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaBookmark } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import axisoInstance from "../api/axiosInstance";

const SearchResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchPosts = location?.state?.searchPosts;
  const query = location?.state?.query;

  const [userDetails, setUserDetails] = useState({});

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

  const handlePost = (post) => {
    navigate(`/post/${post._id}`);
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axisoInstance.get("/user/me");
      setUserDetails(response?.data?.user);
    } catch (error) {
      return console.log("error : ", error);
    }
  };

  return (
    <HomeLayout>
      {!location?.state && (
        <div className="flex items-center justify-center h-screen text-center">
          <p className="text-3xl font-medium text-gray-600">
            Please enter your search!
          </p>
        </div>
      )}
      {query && (
        <p className="text-3xl font-medium mt-24 text-center text-gray-600">
          Search for <span style={{ color: "#4A90E2" }}>{query}</span>
        </p>
      )}

      {searchPosts?.length > 0 ? (
        searchPosts?.map((post) => (
          <>
            <div
              onClick={() => handlePost(post)}
              key={post?._id}
              className="flex w-full cursor-pointer my-4 transition duration-300  bg-white py-3 hover:bg-gray-200  rounded-lg overflow-hidden"
            >
              <div className="flex-1 ">
                <div className="px-6 py-4">
                  <div className=" flex items-center gap-2">
                    <img
                      className=" h-12 w-12 rounded-full border border-black"
                      src={
                        post.postOwner.profilePic
                          ? post.postOwner.profilePic
                          : "https://tse4.mm.bing.net/th?id=OIP.GeEEvvh1bNc8fdvZsq4gQwHaHa&pid=Api&P=0&h=180"
                      }
                      alt="auther-profile"
                    />
                    <p className=" text-black text-xl">
                      {post.postOwner.username}{" "}
                    </p>
                  </div>
                  <h2 className="text-3xl text-start mt-3 font-bold text-gray-800">
                    {post.title.split(" ").slice(0, 15).join(" ")}
                  </h2>
                  <p className="text-gray-700 text-xl font-semibold mt-2">
                    {post.contentText.split(" ").slice(0, 50).join(" ")}
                  </p>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className=" flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                      {post?.likes?.includes(userDetails?._id) ? (
                        <BiSolidLike size={40} />
                      ) : (
                        <BiLike size={40} />
                      )}
                      <p className="text-4xl font-semibold">
                        {post?.likes?.length}
                      </p>
                    </div>
                    {userDetails?.bookmarks?.includes(post?._id) ? (
                      <FaBookmark size={40} />
                    ) : (
                      <CiBookmark size={40} />
                    )}
                  </div>
                  <p className=" text-black font-semibold text-base">
                    {handleDate(post.createdAt)}{" "}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-1/3">
                <img
                  src={post?.contentImage?.secure_url}
                  className="w-full h-[300px] object-cover rounded"
                  alt="post-image"
                />
              </div>
            </div>
          </>
        ))
      ) : (
        <div className="flex items-center justify-center h-screen text-center">
          <p className="text-3xl font-medium text-gray-600">
            No results found for your search!
          </p>
        </div>
      )}
    </HomeLayout>
  );
};

export default SearchResult;
