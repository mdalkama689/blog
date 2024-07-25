import React from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Write = () => {
  return (
    <Link to="/upload-blog">
      <FaRegPenToSquare size={40} />
    </Link>
  );
};

export default Write;
