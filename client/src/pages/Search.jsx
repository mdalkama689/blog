import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import axisoInstance from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [searchPosts, setSearchPosts] = useState([]);

  const navigate = useNavigate();

  const handleSearchPosts = async () => {
    try {
      if(!query.trim()) return
      const response = await axisoInstance.get(
        `/post/search?filter=${encodeURIComponent(query)}`
      );
      setSearchPosts(response?.data?.posts);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      handleSearchPosts();
    } else {
      setSearchPosts([]);
    }
  }, [query]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchPosts();
      navigate("/search-post", { state: { searchPosts, query } });
    }
  };

  return (
    <>
      <Link
        to="/search-post"
        className="flex justify-between items-center bg-gray-200 w-[400px] gap-1 px-0.5 py-1 rounded-md"
      >
        <CiSearch className="text-black ml-2 text-3xl" />
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-1 text-black placeholder-gray-500 bg-transparent text-xl outline-none"
        />
      </Link>
    </>
  );
};

export default Search;
