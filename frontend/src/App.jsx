import Blogs from "./components/Blogs";
import { useSelector } from "react-redux";
import { Route, Routes, useMatch } from "react-router-dom";
import Users from "./components/Users";
import Header from "./components/Header";
import User from "./components/User";
import Blogpost from "./components/Blogpost";
import Welcome from "./components/Welcome";

export default function App() {
  const user = useSelector((state) => state.user);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-lg items-center space-x-4">
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blogpost />} />
      </Routes>
    </div>
  );
}
