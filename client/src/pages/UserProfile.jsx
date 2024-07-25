import React, { useState, useEffect } from "react";
import HomeLayout from "../components/HomeLayout";
import { FaEdit } from "react-icons/fa";
import axisoInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({
    fullname: "",
    username: "",
    email: "",
    profilePic: "",
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserDetails = (user) => {
    setUserDetails({
      fullname: user.fullname,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic.secure_url,
    });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axisoInstance.get("/user/me");
      handleUserDetails(response?.data?.user);
    } catch (error) {
      return console.log("error : ", error);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setUserDetails((prev) => ({
          ...prev,
          profilePic: fileReader.result,
        }));
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleUpdateUserDetails = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("fullname", userDetails.fullname);
      formData.append("email", userDetails.email);
      formData.append("username", userDetails.username);
      if (profilePicFile) {
        formData.append("user-profile-pic", profilePicFile);
      }
      await axisoInstance.post("/user/update/profile", formData);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return console.log("error : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-lg mx-auto p-6 mt-40 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
        <div className="relative inline-block ">
          <img
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            src={userDetails.profilePic || 'https://tse2.mm.bing.net/th?id=OIP.cphbUmdFsam1huiAHaOnGwHaFB&pid=Api&P=0&h=180'}
            alt="profilepic"
          />
          <label
            htmlFor="user-profile-pic"
            className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer flex items-center justify-center"
          >
            {" "}
            <FaEdit onChange={handleChangeImage} />
          </label>
          <input
            type="file"
            disabled={isLoading}
            name="user-profile-pic"
            id="user-profile-pic"
            className=" hidden"
            accept="image/*"
            onChange={handleChangeImage}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="fullname"
            disabled={isLoading}
            name="fullname"
            type="text"
            value={userDetails.fullname}
            onChange={handleChangeInput}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your full name"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            disabled={isLoading}
            value={userDetails.email}
            onChange={handleChangeInput}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your full name"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            disabled={isLoading}
            type="text"
            value={userDetails.username}
            onChange={handleChangeInput}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your full name"
          />
        </div>
        <button
          type="button"
          disabled={isLoading}
          onClick={handleUpdateUserDetails}
          className=" w-full bg-black text-white rounded p-1.5 hover:bg-gray-900 transition duration-300"
        >
          {isLoading ? <ClipLoader size={18} color="white" /> : "Save Changes"}
        </button>
      </div>
    </HomeLayout>
  );
};

export default UserProfile;
