import React from "react";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AuthWrapper from "./components/AuthWrapper";
import UploadBlog from "./pages/UploadBlog";
import EachPost from "./pages/EachPost";
import AllPostsOfLoggedInUser from "./pages/AllPostsOfLoggedInUser";
import BookMarks from "./pages/BookMarks";
import SearchResult from "./pages/SearchResult";
import UserProfile from "./pages/UserProfile";
import PageNotFound from "./pages/PageNotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AuthWrapper />}>
        <Route path="/" element={<Home />} />
        <Route path="/upload-blog" element={<UploadBlog />} />
        <Route path="/post/:postId" element={<EachPost />} />
        <Route path="/your-all-post" element={<AllPostsOfLoggedInUser />} />
        <Route path="/your-bookmarks-post" element={<BookMarks />} />
        {<Route path="/search-post" element={<SearchResult />} />}
        {<Route path="/profile" element={<UserProfile />} />}
      </Route>
      {<Route path="/*" element={<PageNotFound/>} />}
    </Routes>
  );
};

export default App;
