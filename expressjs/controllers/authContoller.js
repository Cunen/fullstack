import { mongodb } from "../utilities/database.js";

export const authController = (req, res, next) => {
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
  const usersCollection = mongodb.collection("users");
  usersCollection.findOne({ username: "cunen" }).then((user) => {
    if (user) {
      req.loggedInUser = user;
      next();
    } else {
      res.render("root", { page: "root", pageTitle: "ExpressJS" });
    }
  });

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
