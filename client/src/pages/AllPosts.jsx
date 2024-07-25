import React from "react";
import PostCard from "../pages/PostCard";

const AllPosts = ({ allPosts }) => {
  return (
    <div className=" flex flex-col gap-2 bg-gray-300 pt-3">
      {allPosts.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-3xl font-bold">
            No blogs found. Try creating one or checking back later!
          </div>
        </div>
      ) : (
        allPosts?.map((post) => <PostCard key={post?._id} post={post} />)
      )}
    </div>
  );
};

export default AllPosts;
