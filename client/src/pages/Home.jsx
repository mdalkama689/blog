import React, { useEffect, useState } from "react";
import HomeLayout from "../components/HomeLayout";
import axisoInstance from "../api/axiosInstance";
import AllPosts from "./AllPosts";
import toast from "react-hot-toast";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

  const handleCategory = (category) => {
    setActiveCategory(category);
    if (category.toLowerCase() === "for you") {
      getAllPosts();
    } else {
      filterCategoryPosts(category);
    }
  };

  useEffect(() => {
    getAllPosts();
    setActiveCategory("For you");
  }, []);

  const filterCategoryPosts = async (category) => {
    try {
      const response = await axisoInstance.get(
        `/post/category?filter=${category}`
      );
      setAllPosts(response?.data?.allFilterPosts);
      toast.success("Blogs fetch successfully!");
    } catch (error) {
      console.log("error : ", error);
      return toast.error("Failed to fetch the all blog!");
    }
  };

  const getAllPosts = async (e) => {
    try {
      const response = await axisoInstance.get("/post/all");
      setAllPosts(response?.data?.allPosts);
      toast.success("Blogs fetch successfully!");
    } catch (error) {
      console.log("error : ", error);
      return toast.error("Failed to fetch the all blog!");
    }
  };

  const categories = [
    "Technology",
    "Programming",
    "Entrepreneurship",
    "Startups",
    "Artificial Intelligence",
    "Finance",
  ];

  return (
    <HomeLayout>
      <div className=" flex justify-between items-center flex-wrap pt-24 p-9">
        <p
          className={`text-3xl cursor-pointer ${
            activeCategory === "For you" ? "underline" : ""
          }`}
          onClick={() => handleCategory("For you")}
        >
          For you
        </p>
        {categories.map((category) => (
          <p
            key={category}
            onClick={() => handleCategory(category)}
            className={`text-3xl cursor-pointer ${
              activeCategory === category ? "underline" : ""
            }`}
          >
            {category}
          </p>
        ))}
      </div>
      <div className=" w-full h-[1px] bg-black"></div>
      <AllPosts allPosts={allPosts} />
    </HomeLayout>
  );
};

export default Home;
