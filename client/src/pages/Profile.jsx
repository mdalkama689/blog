import React, { useEffect, useState } from "react";
import { FaRegCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { LuLogOut } from "react-icons/lu";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { setUserDetails, setIsLoggedIn } from "../Slices/AuthSlice";
import { toast } from "react-hot-toast";
import { BsFileEarmarkPostFill } from "react-icons/bs";
import { IoBookmarks } from "react-icons/io5";
import axisoInstance from "../api/axiosInstance";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axisoInstance.get("/user/me");
  
      setUserProfilePic(response?.data?.user?.profilePic?.secure_url);
    } catch (error) {
      return console.log("error : ", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async (e) => {
    const response = await axiosInstance.post("/user/logout");
    if (response?.data?.success) {
      localStorage.clear();
      dispatch(setUserDetails({}));
      dispatch(setIsLoggedIn(false));
      navigate("/login");
      toast.success("User logged out successfully!");
    }
  };

  return (
    <div className=" relative cursor-pointer" onClick={toggleDropdown}>
      <div>
        <img
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
          src={
            userProfilePic ||
            "https://tse2.mm.bing.net/th?id=OIP.cphbUmdFsam1huiAHaOnGwHaFB&pid=Api&P=0&h=180"
          }
          alt="profilepic"
        />
      </div>
      {isOpen && (
        <div className="absolute w-52 right-0 mt-2 py-4 flex flex-col gap-3 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <Link
            to="/profile"
            className="flex items-center gap-5 justify-start w-full px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
          >
            <RxAvatar size={40} className="text-black" />
            <p className="text-xl font-semibold">Profile</p>
          </Link>
          <div
            onClick={handleLogout}
            className="flex items-center  gap-3 w-full px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
          >
            <LuLogOut size={40} className="text-black" />
            <p className="text-lg">Logout</p>
          </div>
          <Link
            to="/your-all-post"
            className="flex items-center gap-5 justify-start w-full px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
          >
            <BsFileEarmarkPostFill size={40} className="text-black" />
            <p className="text-xl font-semibold"> Your All Posts </p>
          </Link>

          <Link
            to="/your-bookmarks-post"
            className="flex items-center gap-5 justify-start w-full px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
          >
            <IoBookmarks size={40} className="text-black" />
            <p className="text-xl font-semibold"> BooksMark Posts </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
