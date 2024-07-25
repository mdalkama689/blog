import React, { useState } from "react";
import HomeLayout from "../components/HomeLayout";
import axisoInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const UploadBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");

  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const categories = [
    "Technology",
    "Programming",
    "Entrepreneurship",
    "Startups",
    "Artificial Intelligence",
    "Finance",
  ];

  const handleUploadBlog = async (e) => {
    try {
      e.preventDefault();
      if (
        !formData.title.trim() ||
        !formData.category.trim() ||
        !formData.content.trim() ||
        !image
      ) {
        return toast.error("All fileds are required");
      }
      setIsLoading(true);
      const formValues = new FormData();
      formValues.append("title", formData.title);
      formValues.append("contentText", formData.content);
      formValues.append("category", formData.category);
      formValues.append("post-image", image);
      const response = await axisoInstance.post("/post/create", formValues);
      toast.success(response?.data?.message);
      setFormData({
        title: "",
        content: "",
        category: "",
      });
      setImage("");
      navigate("/");
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
    <HomeLayout>
      <div className="max-w-4xl mt-[150px] mx-auto p-6 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Upload a New Blog
        </h2>
        <form onSubmit={handleUploadBlog} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChangeInput}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 sm:text-sm"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              type="text"
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChangeInput}
              rows={12}
              disabled={isLoading}
              className="mt-1 block  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChangeInput}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 sm:text-sm"
            >
              <option value="" disabled>
                Select an option
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          ></label>
          <input
            type="file"
            id="image"
            onChange={handleImage}
            disabled={isLoading}
            accept="image/*"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 sm:text-sm"
          />
          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader size={18} color="white" />
              ) : (
                "Upload Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
};

export default UploadBlog;
