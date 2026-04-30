export const rootViewController = (req, res) => {
  res.render("root", { page: "root", pageTitle: "ExpressJS" });
};

export const notFoundViewController = (req, res) => {
  res.render("404", { page: "404", pageTitle: "Page Not Found" });
};

export const errorViewController = (error, req, res, next) => {
  res.status(500).render("500", { page: "500", pageTitle: "Error", error });
  next();
};
