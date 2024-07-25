import React, { useEffect, useState } from "react";
import HomeLayout from "../components/HomeLayout";
import { BiLike } from "react-icons/bi";
import { CiBookmark } from "react-icons/ci";
import { FaCopy } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import { useSpeechSynthesis } from "react-speech-kit";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axisoInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { MdOutlinePauseCircleFilled } from "react-icons/md";
import { FaBookmark } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";

const EachPost = () => {
  const [textValue, setTextValue] = useState("");
  const [eachPost, setEachPost] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [url, setUrl] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const { speak, cancel, speaking } = useSpeechSynthesis();

  const { postId } = useParams();

  useEffect(() => {
    const fetchpost = async () => {
      try {
        const response = await axisoInstance.get(`/post/get/${postId}`);
        setEachPost(response?.data?.post);
        setEachPost(response?.data?.post);
        setTextValue(response?.data?.post?.contentText);
        toast.success("Post fetch successfully!");
      } catch (error) {
        console.log("error : ", error);
        return toast.error("Post fetch failed!");
      }
    };
    fetchpost();
    setUrl(window.location.href);
  }, []);

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
    const getFullYear = date.getFullYear();
    const getMonth = shortMonths[date.getMonth()];
    const getDate = date.getDate();
    const formattedDate = `${getDate} ${getMonth} ${getFullYear}`;
    return formattedDate;
  };

  const handleControlSpeech = () => {
    if (speaking) {
      cancel();
      setIsSpeaking(false);
    } else {
      speak({ text: textValue });
      setIsSpeaking(true);
    }
  };

  const handleCopy = () => {
    toast.success("Link copied!");
  };

  const handleLike = async (postId) => {
    try {
      const response = await axisoInstance.post(`/post/toggle/like/${postId}`);
      toast.success(response?.data?.message);

      window.location.reload();
    } catch (error) {
      console.log("error : ", error);
      return toast.error("Error during like!");
    }
  };

  const handleBookmarks = async (postId) => {
    try {
      console.log("post Id: ", postId);
      const response = await axisoInstance.post(
        `/post/save/bookmark/${postId}`
      );
      toast.success(response?.data?.message);

      window.location.reload();
    } catch (error) {
      console.log("error : ", error);
      return toast.error("Error during bookmark post!");
    }
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
      <div className="pt-24 flex items-center gap-5 ml-6">
        <div>
          <img
            className="h-12 w-12 rounded-full border border-black"
            src={
              eachPost?.postOwner?.profilePic?.secure_url
                ? eachPost?.postOwner?.profilePic?.secure_url
                : "https://tse4.mm.bing.net/th?id=OIP.GeEEvvh1bNc8fdvZsq4gQwHaHa&pid=Api&P=0&h=180"
            }
            alt="author-profile"
          />
        </div>

        <div>
          <p className="text-center font-bold text-xl">
            {eachPost?.postOwner?.username}
          </p>
          <p>Category: {eachPost?.category}</p>
        </div>
        <div className="flex items-center justify-center">
          <p className="font-semibold text-xl">
            {handleDate(eachPost.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 mt-9 border border-gray-300">
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2">
            {eachPost?.likes?.includes(userDetails?._id) ? (
              <>
                <BiSolidLike
                  className=" cursor-pointer"
                  onClick={() => handleLike(eachPost?._id)}
                  size={60}
                />
                <p className="text-4xl font-semibold">
                  {eachPost?.likes?.length}
                </p>
              </>
            ) : (
              <>
                <BiLike
                  className=" cursor-pointer"
                  onClick={() => handleLike(eachPost?._id)}
                  size={60}
                />
                <p className="text-4xl font-semibold">
                  {eachPost?.likes?.length}
                </p>
              </>
            )}
          </div>
          {userDetails?.bookmarks?.includes(eachPost?._id) ? (
            <FaBookmark
              className=" cursor-pointer"
              onClick={() => handleBookmarks(eachPost?._id)}
              size={60}
            />
          ) : (
            <CiBookmark
              className=" cursor-pointer"
              onClick={() => handleBookmarks(eachPost?._id)}
              size={60}
            />
          )}
        </div>
        <div className="flex items-center gap-7">
          {isSpeaking ? (
            <MdOutlinePauseCircleFilled
              className=" cursor-pointer"
              onClick={handleControlSpeech}
              size={60}
            />
          ) : (
            <FaRegCirclePlay
              className=" cursor-pointer"
              onClick={handleControlSpeech}
              size={60}
            />
          )}

          <CopyToClipboard text={url} onCopy={handleCopy}>
            <FaCopy size={60} className=" cursor-pointer" />
          </CopyToClipboard>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-start ml-6 my-2 text-gray-900 ">
        {eachPost?.title}
      </h1>

      <div className="flex items-center justify-center flex-col mt-10">
        <img
          src={eachPost?.contentImage?.secure_url}
          className="w-full h-auto px-4 py-2 rounded-lg shadow-lg border border-gray-200"
          alt="post-image"
        />
        <div className="px-7 mb-10 w-full h-fit mt-8 text-2xl font-semibold text-start overflow-hidden resize-none">
          {eachPost?.contentText}
        </div>
      </div>
    </HomeLayout>
  );
};

export default EachPost;
