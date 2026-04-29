import { validationResult } from "express-validator";
import redirectWithNotification from "../utilities/notification.js";
import { User } from "./databaseController.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
  const { name, username, email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return redirectWithNotification(
      req,
      res,
      "/view/register",
      "error",
      errors
        .array()
        .map((e) => e.path + ": " + e.msg)
        .join(", ")
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

export const requestResetViewController = (req, res) => {
  if (req?.session?.user) return res.redirect("/");
  const { token } = req.query;
  res.render("password-forgot", {
    page: "login",
    pageTitle: "Request Password Reset",
    token,
  });
};

export const requestResetController = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // For security, we do not tell whether or not it succeeded
  if (!user) return res.redirect("/view/password-reset");

  user.resetToken = crypto.randomBytes(32).toString("hex");
  user.resetTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour from now
  await user.save();

  // Normally we'd send an email with this token, but this is a demo...
  return res.redirect("/view/password-reset?token=" + user.resetToken);
};

export const resetPasswordController = async (req, res) => {
  const { token, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return redirectWithNotification(
      req,
      res,
      "/view/password-reset/" + token,
      "error",
      "Password and confirm password do not match"
    );
  }

  const user = await User.findOne({
    email,
    resetToken: token,
    resetTokenExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    return redirectWithNotification(
      req,
      res,
      "/view/password-reset/" + token,
      "error",
      "Failed to reset password. Invalid or expired token."
    );
  }

  const hash = bcrypt.hashSync(password, 10);

  user.password = hash;
  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;

  await user.save();

  return redirectWithNotification(
    req,
    res,
    "/view/login",
    "success",
    "Password reset successful. You can now log in with your new password."
  );
};

export const resetPasswordViewController = async (req, res) => {
  if (req?.session?.user) return res.redirect("/");

  const { token } = req.params;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    return redirectWithNotification(
      req,
      res,
      "/view/login",
      "error",
      "Invalid or expired password reset token"
    );
  }

  return res.render("password-reset", {
    page: "login",
    pageTitle: "Reset Password",
    token,
    email: user.email,
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
