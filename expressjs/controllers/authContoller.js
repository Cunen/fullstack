import { SeqUser } from "../utilities/database.js";

export const authController = (req, res, next) => {
  // MongoDB Login
  const db = req.app.get("mongodb");
  const usersCollection = db.collection("users");
  usersCollection.findOne({ username: "cunen" }).then((user) => {
    if (!user) {
      usersCollection
        .insertOne({
          name: "Kalle",
          email: "ka.kuparinen@gmail.com",
          passwordHash: "hashedpassword",
          username: "cunen",
        })
        .then((user) => {
          console.log("MongoDB user created:", user);
        });
    } else {
      console.log("MongoDB user:", user);
    }
  });

  // Temporary
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
};
