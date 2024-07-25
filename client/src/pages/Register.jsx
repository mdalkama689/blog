import React, { useState } from "react";
import toast from "react-hot-toast";
import axisoInstance from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const formValidation = () => {
    const fullnameRegex = /^[a-zA-Z ]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!formData.fullname.trim() || !fullnameRegex.test(formData.fullname)) {
      return toast.error("Please enter valid fullname");
    }
    if (!emailRegex.test(formData.email)) {
      return toast.error("Please enter valid email address");
    }

    if (!usernameRegex.test(formData.username)) {
      return toast.error("Please enter valid username");
    }
    if (formData.password.trim().length < 8) {
      return toast.error("Password must be atleast eight characters");
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      formValidation();
      const response = await axisoInstance.post("/user/register", formData);

      if (response?.data?.success) {
        setFormData({
          fullname: "",
          email: "",
          username: "",
          password: "",
        });
        navigate("/login");
      }
    } catch (error) {
      console.log("error : ", error);
      return toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullname"
            >
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fullname"
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChangeInput}
              placeholder="Full Name"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChangeInput}
              type="email"
              placeholder="Email"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChangeInput}
              type="text"
              placeholder="Username"
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChangeInput}
              disabled={isLoading}
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader size={18} /> : "Register"}
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-600">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
