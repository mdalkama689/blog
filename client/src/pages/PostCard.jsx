import React, { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axisoInstance from "../api/axiosInstance";
import { FaBookmark } from "react-icons/fa6";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

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
    <>
      <div
        onClick={() => handlePost(post)}
        className="flex w-full cursor-pointer my-1 transition duration-300  bg-white py-3 hover:bg-gray-200  rounded-lg overflow-hidden"
      >
        <div className="flex-1 ">
          <div className="px-6 py-4">
            <div className=" flex items-center gap-2">
              <img
                className=" h-12 w-12 rounded-full border border-black"
                src={
                  post.postOwner.profilePic?.secure_url
                    ? post.postOwner.profilePic?.secure_url
                    : "https://tse4.mm.bing.net/th?id=OIP.GeEEvvh1bNc8fdvZsq4gQwHaHa&pid=Api&P=0&h=180"
                }
                alt="auther-profile"
              />
              <p className=" text-black text-xl">{post.postOwner.username} </p>
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
                <p className="text-4xl font-semibold">{post?.likes?.length}</p>
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
  );
};

export default PostCard;
