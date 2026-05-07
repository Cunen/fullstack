import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Posts from "../pages/Posts/Posts";
import Post from "../pages/Posts/Post";
import NewPost from "../pages/Posts/NewPost";
import Register from "../pages/Login/Register";
import Logout from "../pages/Login/Logout";
import Login from "../pages/Login/Login";
import { Providers } from "./Providers";
import AuthView from "../providers/Auth/AuthView";

export const RouterProvider: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Providers />}>
          <Route
            path="/post/:id"
            element={
              <AuthView redirect>
                <Post />
              </AuthView>
            }
          />
          <Route
            path="/add"
            element={
              <AuthView redirect>
                <NewPost />
              </AuthView>
            }
          />
          <Route
            path="/login"
            element={
              <AuthView redirect showForUnauthenticated>
                <Login />
              </AuthView>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/register"
            element={
              <AuthView redirect showForUnauthenticated>
                <Register />
              </AuthView>
            }
          />
          <Route
            path="/"
            element={
              <AuthView redirect>
                <Posts />
              </AuthView>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default RouterProvider;
