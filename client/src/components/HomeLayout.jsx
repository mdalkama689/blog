import React from "react";
import Logo from "../pages/Logo";
import Search from "../pages/Search";
import Profile from "../pages/Profile";
import Write from "../pages/Write";

const HomeLayout = ({ children }) => {
  return (
    <div className=" relative">
      <header className="fixed top-0 w-full bg-gray-300 flex items-center justify-between px-4 py-3">
        <Logo />
        <Search />
        <Write />
        <Profile />
      </header>
      {children}
    </div>
  );
};

export default HomeLayout;
