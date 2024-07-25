import React, { lazy, useEffect, useId, useState } from "react";
import HomeLayout from "../components/HomeLayout";
import toast from "react-hot-toast";
import axisoInstance from "../api/axiosInstance";
import { MdDelete } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const AllPostsOfLoggedInUser = () => {
  const [allposts, setAllPosts] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [eachPostDetails, setEachPostDetails] = useState({
    title: "",
    contentText: "",
    category: "",
  });
  const [postImage, setPostImage] = useState("");
  const navigate = useNavigate();

  const getAllPostsOfLoggedInUser = async (e) => {
    try {
      const response = await axisoInstance.get("/post/");

      setAllPosts(response?.data?.allPosts);
      console.log(response?.data?.allPosts)
      toast.success("Blogs fetch successfully!");
    } catch (error) {
      console.log("error : ", error);
      return toast.error("Failed to fetch the all blog!");
    }
  };

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

  useEffect(() => {
    getAllPostsOfLoggedInUser();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await axisoInstance.delete(`/post/delete/${postId}`);
      toast.success("Blog deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.log("error : ", error);
      return toast.error("Failed to delete blog!");
    }
  };

  const updatePost = async (post) => {
    setIsEdited(!isEdited);
    setEditPostId(post?._id);
    setEachPostDetails({
      title: post?.title,
      contentText: post?.contentText,
      category: post?.category,
    });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setEachPostDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const categories = [
    "Technology",
    "Programming",
    "Entrepreneurship",
    "Startups",
    "Artificial Intelligence",
    "Finance",
  ];

  const handleUpdatePost = async (e) => {
    try {
      e.preventDefault();
      setIsEdited(true);
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", eachPostDetails.title);
      formData.append("contentText", eachPostDetails.contentText);
      formData.append("category", eachPostDetails.category);
      formData.append("post-image", postImage);

      const response = await axisoInstance.put(
        `/post/update/${editPostId}`,
        formData
      );
      if (response?.data?.success) {
        window.location.reload();
        toast.success("Blog uppdated successfully!");
      }
    } catch (error) {
      console.log("error : ", error);
      return toast.error("Error during update the blog!");
    } finally {
      setEditPostId(null);
      setIsEdited(false);
      setIsLoading(false);
    }
  };

  const handleImageInput = (e) => {
    setPostImage(e.target.files[0]);
  };

  const handlePost = (post) => {
    navigate(`/post/${post._id}`);
  };

  return (
    <HomeLayout>
      <h1 className=" mt-24 text-center font-bold text-3xl mb-7">
        Your all posts!{" "}
      </h1>
      {allposts.length > 0 ? (
        allposts?.map((post) => (
          <div className=" border border-black py-3 my-8 rounded-lg overflow-hidden  hover:bg-gray-200 bg-white transition duration-300">
            <div
              onClick={() => handlePost(post)}
              key={post._id}
              className={`flex w-full cursor-pointer  ${
                isEdited ? "flex-col" : ""
              }`}
            >
              <div className="flex-1 ">
                <div className="px-6 py-4">
                  <div className=" flex items-center gap-2">
                    <img
                      className=" h-12 w-12 rounded-full border border-black"
                      src={
                        post?.postOwner?.profilePic?.secure_url
                          ?     post?.postOwner?.profilePic?.secure_url
                          : "https://tse4.mm.bing.net/th?id=OIP.GeEEvvh1bNc8fdvZsq4gQwHaHa&pid=Api&P=0&h=180"
                      }
                      alt="auther-profile"
                    />
                    <div>
                      <p className=" text-black text-xl">
                        {post.postOwner.username}{" "}
                      </p>
                      {isEdited && post?._id === editPostId ? (
                        <label htmlFor="category">
                          Category :
                          <select
                            name="category"
                            id="category"
                            disabled={isLoading}
                            onChange={handleChangeInput}
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <p className=" text-black text-sm font-semibold">
                          Category : {post.category}{" "}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEdited && post?._id === editPostId ? (
                    <div className=" mt-10">
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
                        value={eachPostDetails.title}
                        onChange={handleChangeInput}
                        className="mt-1 block w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 sm:text-sm"
                        disabled={isLoading}
                      />
                    </div>
                  ) : (
                    <h2 className="text-3xl text-start mt-3 font-bold text-gray-800">
                      {post.title.split(" ").slice(0, 15).join(" ")}
                    </h2>
                  )}
                  {isEdited && post?._id === editPostId ? (
                    <div>
                      <label
                        htmlFor="contentText"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Content
                      </label>
                      <textarea
                        type="text"
                        id="contentText"
                        name="contentText"
                        value={eachPostDetails.contentText}
                        onChange={handleChangeInput}
                        rows={12}
                        disabled={isLoading}
                        className="mt-1 block cursor-pointer  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 sm:text-sm"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-700 text-xl font-semibold mt-2">
                      {post.contentText.split(" ").slice(0, 50).join(" ")}
                    </p>
                  )}
                </div>

                {isEdited && post?._id === editPostId && (
                  <>
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    ></label>
                    <input
                      type="file"
                      id="image"
                      onChange={handleImageInput}
                      disabled={isLoading}
                      accept="image/*"
                      className="mt-1 block cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 sm:text-sm"
                    />
                  </>
                )}
              </div>
              {!isEdited && (
                <div className="w-full sm:w-1/3">
                  <img
                    src={post?.contentImage?.secure_url}
                    className="w-full h-[300px] object-cover rounded"
                    alt="post-image"
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div className=" flex items-center justify-between gap-6">
                {isEdited && post?._id === editPostId && (
                  <button
                    type="submit"
                    onClick={handleUpdatePost}
                    className="w-full mt-7 mb-5 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ClipLoader size={18} color="white" />
                    ) : (
                      "Save changes"
                    )}
                  </button>
                )}
                {!isEdited && (
                  <p
                    onClick={() => updatePost(post)}
                    className=" text-2xl font-bold cursor-pointer"
                  >
                    Edit
                  </p>
                )}
                {!isEdited && (
                  <MdDelete
                    onClick={() => handleDeletePost(post?._id)}
                    size={40}
                    color="red"
                    className=" cursor-pointer"
                  />
                )}
              </div>
              <p className=" text-black font-semibold text-base">
                {handleDate(post.createdAt)}{" "}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-4xl font-semibold text-gray-600">
            You don't have any blog posts yet!.
          </p>
        </div>
      )}
    </HomeLayout>
  );
};

export default AllPostsOfLoggedInUser;
