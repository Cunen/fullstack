export const rootViewController = (req, res) => {
  res.render("root", { page: "root", pageTitle: "ExpressJS" });
};

export const notFoundViewController = (req, res) => {
  res.render("404", { page: "404", pageTitle: "Page Not Found" });
};
