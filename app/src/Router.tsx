import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Posts from "./pages/Posts/Posts";
import Post from "./pages/Posts/Post";
import Sidebar from "./Sidebar";
import NewPost from "./pages/Posts/NewPost";
import Register from "./pages/Login/Register";
import Logout from "./pages/Login/Logout";
import Login from "./pages/Login/Login";

export const RouterProvider: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Sidebar />}>
          <Route path="/post/:id" element={<Post />} />
          <Route path="/add" element={<NewPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Posts />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default RouterProvider;
