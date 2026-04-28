import { User } from "./databaseController.js";
import bcrypt from "bcrypt";

export const logoutViewController = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/view/login");
  });
};

export const loginController = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.redirect("/view/login?error=Invalid%20credentials");
  }

  if (bcrypt.compareSync(password, user.password)) {
    req.session.userId = user._id.toString();
    res.redirect("/");
  } else {
    return res.redirect("/view/login?error=Invalid%20credentials");
  }
};

export const loginViewController = (req, res) => {
  if (req?.session?.userId) return res.redirect("/");

  const { error } = req.query;
  res.render("login", { page: "login", pageTitle: "Login", error });
};

export const registerController = async (req, res) => {
  const { name, username, email, password, confirmPassword } = req.body;

  const passwordOK = password === confirmPassword;

  if (!passwordOK) {
    return res.redirect("/view/register?error=Passwords%20do%20not%20match");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (user) {
    return res.redirect(
      "/view/register?error=Username%20or%20email%20already%20exists"
    );
  }

  const hash = bcrypt.hashSync(password, 10);

  await User.create({ name, username, email, password: hash });

  return res.redirect("/view/login");
};

export const registerViewController = (req, res) => {
  if (req?.session?.userId) return res.redirect("/");
  const { error } = req.query;
  res.render("register", { page: "register", pageTitle: "Register", error });
};

export const authController = async (req, res, next) => {
  if (!req?.session?.userId) {
    return res.redirect("/view/login");
  }

  const { userId } = req.session;

  const user = await User.findById(userId);

  if (user) {
    req.loggedInUser = user;
    res.locals.userIsLoggedIn = true;
    next();
  } else {
    res.redirect("/view/login");
  }

  /* User Creation 
    usersCollection
      .insertOne({
        name: "Kalle",
        email: "ka.kuparinen@gmail.com",
        passwordHash: "hashedpassword",
        username: "cunen",
      })
  */

  // MongoDB Login
  /*
  User.findByUsername("cunen").then((user) => {
    if (user) {
      req.loggedInUser = user;
      next();
    } else {
      res.render("root", { page: "root", pageTitle: "ExpressJS" });
    }
  });
  */

  /* Sequelize Login
  SeqUser.findByPk(1)
    .then((user) => {
      if (!user) {
        // Temp creation
        SeqUser.create({
          name: "Kalle",
          email: "ka.kuparinen@gmail.com",
          passwordHash: "hashedpassword",
          username: "cunen",
        });
        throw new Error("No user found");
      }
      // Attach user to request object for later use
      req.loggedInUser = user;
      next();
    })
    .catch((e) => {
      console.error("Authentication error:", e);
      res.render("root", { page: "root", pageTitle: "ExpressJS" });
    });
    */
};
