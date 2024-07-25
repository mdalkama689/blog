import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <h1 className="text-4xl font-bold text-black">Blogify</h1>
    </Link>
  );
};

export default Logo;
