import redirectWithNotification from "../utilities/notification.js";
import { User } from "./databaseController.js";
import bcrypt from "bcrypt";

export const logoutViewController = async (req, res) => {
  await req.session.destroy();
  return res.redirect("/view/login");
};

export const loginController = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return redirectWithNotification(
      req,
      res,
      "/view/login",
      "error",
      "Invalid username or password"
    );
  }

  if (bcrypt.compareSync(password, user.password)) {
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
    };
    await req.session.save();
    return redirectWithNotification(
      req,
      res,
      "/",
      "info",
      "Successfully logged in"
    );
  } else {
    return redirectWithNotification(
      req,
      res,
      "/view/login",
      "error",
      "Invalid username or password"
    );
  }
};

export const loginViewController = (req, res) => {
  if (req?.session?.user) return res.redirect("/");

  const { error } = req.query;
  res.render("login", {
    page: "login",
    pageTitle: "Login",
    error,
  });
};

export const registerController = async (req, res) => {
  const { name, username, email, password, confirmPassword } = req.body;

  const passwordOK = password === confirmPassword;

  if (!passwordOK) {
    return redirectWithNotification(
      req,
      res,
      "/view/register",
      "error",
      "Password and confirm password do not match"
    );
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (user) {
    return redirectWithNotification(
      req,
      res,
      "/view/register",
      "error",
      "Username or email already exists"
    );
  }

  const hash = bcrypt.hashSync(password, 10);

  await User.create({ name, username, email, password: hash });

  return redirectWithNotification(
    req,
    res,
    "/view/login",
    "info",
    "Successfully registered"
  );
};

export const registerViewController = (req, res) => {
  if (req?.session?.user) return res.redirect("/");
  const { error } = req.query;
  res.render("register", {
    page: "register",
    pageTitle: "Register",
    error,
  });
};

export const authMiddleware = async (req, res, next) => {
  const { user, notification } = req.session || {};
  res.locals.userIsLoggedIn = !!user;
  res.locals.csrfToken = req.csrfToken();
  res.locals.notification = {};

  if (notification) {
    res.locals.notification = notification;
    delete req.session.notification;
    await req.session.save();
  }

  if (user) req.loggedInUser = user;
  next();
};

/** Allow only authorized users */
export const allowAuth = async (req, res, next) => {
  if (req.loggedInUser) next();
  else
    redirectWithNotification(
      req,
      res,
      "/view/login",
      "error",
      "You need to be logged in to access this page"
    );
};
