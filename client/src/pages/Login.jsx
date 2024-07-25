import React, { useState } from "react";
import toast from "react-hot-toast";
import axisoInstance from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserDetails, setIsLoggedIn } from "../Slices/AuthSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formValidation = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      return toast.error("Please enter email and password");
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      formValidation();
      const response = await axisoInstance.post("/user/login", formData);

      if (response?.data?.success) {
        dispatch(setUserDetails(response?.data?.user));
        dispatch(setIsLoggedIn(true));
        localStorage.setItem(
          "userDetails",
          JSON.stringify(response?.data?.user)
        );
        localStorage.setItem("isLoggedIn", true);
        setFormData({
          fullname: "",
          email: "",
          username: "",
          password: "",
        });
        toast.success("User logged in successfully!");
        navigate("/");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
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
              type="text"
              placeholder="Email"
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
              {isLoading ? <ClipLoader size={18} /> : "Login"}
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-600">
            Register
          </Link>
        </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
